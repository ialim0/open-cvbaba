import { useCallback, useRef } from "react";

interface StreamEvent {
  type: "status" | "chunk" | "complete" | "error";
  content?: string;
  chat?: {
    slug: string;
    pdf_content: string;
    [key: string]: any;
  };
  message?: string;
}

interface StreamCallbacks {
  onChunk: (content: string) => void;
  onComplete: (chat: any) => void;
  onError: (message: string) => void;
  onStatus?: (message: string) => void;
}

// Frontend can now call:
// - For new chat: POST /api/chat/stream
// - For existing chat: PATCH /api/chat/{slug}/stream
// With body: { "user_input": "...", "title": "optional", ... } or FormData for file uploads
// Expect SSE events: status, chunk, complete, error
export const useStreamSubmitData = () => {
  const eventSourceRef = useRef<EventSource | null>(null);

  const streamSubmitData = useCallback(
    (
      slug: string | null,
      data: Record<string, any> | FormData,
      callbacks: StreamCallbacks,
      options?: { method?: string; endpoint?: string }
    ) => {
      // Clean up any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        callbacks.onError("API base URL not configured");
        return;
      }

      // Build the URL
      const endpoint = options?.endpoint || (slug ? `/api/chat/${slug}/stream` : `/api/chat/stream`);
      const url = `${apiBaseUrl}${endpoint}`;

      // Build query parameters
      const params = new URLSearchParams();

      // Build the full URL with query params
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

      const controller = new AbortController();

      // Determine content type and body
      const isMultipart = data instanceof FormData;

      const headers: HeadersInit = {
        "Accept": "text/event-stream",
        "X-Accel-Buffering": "no",
      };

      if (!isMultipart) {
        headers["Content-Type"] = "application/json";
      }
      // Note: When using FormData, fetch automatically sets the Content-Type header with boundary

      fetch(fullUrl, {
        method: options?.method || (slug ? "PATCH" : "POST"),
        headers,
        credentials: "include",
        body: isMultipart ? data : JSON.stringify(data),
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Response body is not readable");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          const readChunk = (): Promise<void> => {
            return reader.read().then(({ done, value }) => {
              if (done) {
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                // Skip empty lines and comments
                if (!line.trim() || line.startsWith(":")) {
                  continue;
                }

                if (line.startsWith("data: ")) {
                  try {
                    const jsonStr = line.slice(6).trim(); // Remove "data: " prefix and trim
                    if (!jsonStr) continue; // Skip empty data

                    const event: StreamEvent = JSON.parse(jsonStr);

                    if (event.type === "status") {
                      callbacks.onStatus?.(event.message || "");
                    } else if (event.type === "chunk" && event.content) {
                      callbacks.onChunk(event.content);
                    } else if (event.type === "complete" && event.chat) {
                      callbacks.onComplete(event.chat);
                      return; // Stop reading after complete
                    } else if (event.type === "error") {
                      callbacks.onError(event.message || "Unknown error");
                      return; // Stop reading on error
                    }
                  } catch (e) {
                    console.error("Error parsing SSE event:", e, line);
                    // Continue processing other lines even if one fails
                  }
                }
              }

              return readChunk();
            });
          };

          return readChunk();
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Stream error:", error);
            callbacks.onError(error.message || "Stream connection failed");
          }
        });

      // Return cleanup function
      return () => {
        controller.abort();
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    },
    []
  );

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  return { streamSubmitData, cleanup };
};

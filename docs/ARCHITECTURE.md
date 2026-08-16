# Architecture

open-cvbaba is a local-first document workspace. The browser owns interaction and preview; the FastAPI service owns orchestration and persistence; PostgreSQL stores document state; Mistral provides generation, OCR, and transcription.

## Runtime topology

```text
Browser
  ├── Next.js UI and editable HTML preview
  ├── SSE document-generation stream
  └── WebSocket Voxtral realtime stream
          │
          ▼
FastAPI
  ├── workspace identification (X-Workspace-ID)
  ├── document orchestration
  ├── Mistral Chat Completions
  ├── Mistral OCR and Voxtral
  └── HTML/PDF rendering
          │
          ├── PostgreSQL: documents, versions, pages, notes, comments
          └── Mistral API
```

## Boundaries

### Frontend

The Next.js application provides document selection, prompt forms, upload and voice input, live generation, document editing, and export controls. It does not contain provider credentials or call Mistral directly.

### API

The FastAPI application validates requests, resolves an anonymous workspace, prepares prompts, calls Mistral, streams results to the browser, and persists completed changes. The workspace identifier is supplied through `X-Workspace-ID`; there is no login or account lifecycle.

### AI layer

All AI capabilities are centralized around Mistral:

- Native `chat.stream_async` for document generation and edits.
- Mistral OCR for PDF and image text extraction.
- Voxtral Mini Transcribe for uploaded audio and realtime PCM transcription.

No Google, Gemini, DeepSeek, Anthropic, or OpenAI service credentials are required.

### Persistence

PostgreSQL stores anonymous local workspaces, chats, document content, versions, pages, comments, and notes. The database is mounted as the `postgres_data` Docker volume.

## Streaming lifecycle

1. The browser opens an SSE request for document generation.
2. The API builds system and user messages with document requirements and context.
3. Mistral returns asynchronous Chat Completion chunks.
4. The API forwards text chunks as SSE events.
5. The browser updates the preview incrementally.
6. The API saves final content and emits a completion event.

Realtime voice input follows the same principle over WebSocket. The browser sends mono 16-bit PCM at 16 kHz; Voxtral returns events that the API maps to partial and final frontend messages.

## Local deployment

Docker Compose starts PostgreSQL 16, FastAPI on port 8000, and Next.js on port 3000. Only `MISTRAL_API_KEY` is required for AI features.

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoResizeOptions {
  minHeight?: number;
  maxHeight?: number;
  lineHeight?: number;
  padding?: number;
  borderWidth?: number;
  smoothTransition?: boolean;
  onResize?: (height: number) => void;
}

export const useAutoResize = (
  value: string,
  options: UseAutoResizeOptions = {}
) => {
  const {
    minHeight = 120,
    maxHeight = 600,
    lineHeight = 24,
    padding = 16,
    borderWidth = 2,
    smoothTransition = true,
    onResize,
  } = options;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousHeightRef = useRef<number>(minHeight);
  const resizeTimeoutRef = useRef<number | null>(null);

  const calculateHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return minHeight;

    // Store current height and overflow
    const originalHeight = textarea.style.height;
    const originalOverflow = textarea.style.overflow;

    // Reset height to auto to get the true scrollHeight
    textarea.style.height = 'auto';
    textarea.style.overflow = 'hidden';

    // Calculate the content height
    let contentHeight = textarea.scrollHeight;

    // Restore original styles
    textarea.style.height = originalHeight;
    textarea.style.overflow = originalOverflow;

    // Apply constraints
    const totalPadding = padding * 2;
    const totalBorder = borderWidth * 2;
    const actualHeight = contentHeight + totalBorder;

    // Ensure height is within bounds
    const boundedHeight = Math.min(Math.max(actualHeight, minHeight), maxHeight);

    return boundedHeight;
  }, [minHeight, maxHeight, padding, borderWidth]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const newHeight = calculateHeight();

    // Only update if height has changed
    if (newHeight !== previousHeightRef.current) {
      // Apply smooth transition
      if (smoothTransition) {
        textarea.style.transition = 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      textarea.style.height = `${newHeight}px`;
      previousHeightRef.current = newHeight;

      // Handle overflow
      if (newHeight >= maxHeight) {
        textarea.style.overflowY = 'auto';
        textarea.style.scrollbarWidth = 'thin';
      } else {
        textarea.style.overflowY = 'hidden';
      }

      // Callback
      onResize?.(newHeight);

      // Remove transition after animation completes
      if (smoothTransition) {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        resizeTimeoutRef.current = window.setTimeout(() => {
          if (textarea) {
            textarea.style.transition = '';
          }
        }, 200);
      }
    }
  }, [calculateHeight, maxHeight, smoothTransition, onResize]);

  // Adjust height on value change
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Adjust height on mount and window resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Initial adjustment
    adjustHeight();

    // Handle window resize
    const handleResize = () => {
      adjustHeight();
    };

    // Handle font loading
    const handleFontLoad = () => {
      adjustHeight();
    };

    window.addEventListener('resize', handleResize);
    document.fonts?.addEventListener?.('loadingdone', handleFontLoad);

    // Observe textarea for size changes
    const resizeObserver = new ResizeObserver(() => {
      adjustHeight();
    });
    resizeObserver.observe(textarea);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.fonts?.removeEventListener?.('loadingdone', handleFontLoad);
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [adjustHeight]);

  // Handle paste events for smooth resizing
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Allow default paste behavior
    setTimeout(() => {
      adjustHeight();
    }, 0);
  }, [adjustHeight]);

  // Handle input events for real-time resizing
  const handleInput = useCallback(() => {
    adjustHeight();
  }, [adjustHeight]);

  return {
    ref: textareaRef,
    onPaste: handlePaste,
    onInput: handleInput,
  };
};





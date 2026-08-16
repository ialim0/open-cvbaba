import { useRef, useEffect, useCallback, useState } from 'react';

interface DragScrollOptions {
  disabled?: boolean;
  momentum?: boolean;
  momentumDecay?: number;
  boundaryElasticity?: number;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}

interface DragScrollReturn {
  ref: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  isScrollable: boolean;
}

export const useDragScroll = (options: DragScrollOptions = {}): DragScrollReturn => {
  const {
    disabled = false,
    momentum = true,
    momentumDecay = 0.95,
    boundaryElasticity = 0.1,
    onScrollStart,
    onScrollEnd,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    velocityX: 0,
    velocityY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    momentumId: null as number | null,
  });

  // Check if content is scrollable
  const updateScrollable = useCallback(() => {
    if (!ref.current) return;
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = ref.current;
    const scrollableX = scrollWidth > clientWidth;
    const scrollableY = scrollHeight > clientHeight;
    setIsScrollable(scrollableX || scrollableY);
  }, []);

  // Momentum scrolling animation
  const applyMomentum = useCallback(() => {
    if (!ref.current || !momentum) return;
    
    const state = dragState.current;
    if (Math.abs(state.velocityX) < 0.5 && Math.abs(state.velocityY) < 0.5) {
      state.momentumId = null;
      onScrollEnd?.();
      return;
    }

    const element = ref.current;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const maxScrollTop = element.scrollHeight - element.clientHeight;

    let newScrollLeft = element.scrollLeft + state.velocityX;
    let newScrollTop = element.scrollTop + state.velocityY;

    // Boundary elasticity
    if (newScrollLeft < 0) {
      newScrollLeft = newScrollLeft * boundaryElasticity;
      state.velocityX *= -0.3; // Bounce back
    } else if (newScrollLeft > maxScrollLeft) {
      newScrollLeft = maxScrollLeft + (newScrollLeft - maxScrollLeft) * boundaryElasticity;
      state.velocityX *= -0.3;
    }

    if (newScrollTop < 0) {
      newScrollTop = newScrollTop * boundaryElasticity;
      state.velocityY *= -0.3;
    } else if (newScrollTop > maxScrollTop) {
      newScrollTop = maxScrollTop + (newScrollTop - maxScrollTop) * boundaryElasticity;
      state.velocityY *= -0.3;
    }

    element.scrollLeft = newScrollLeft;
    element.scrollTop = newScrollTop;

    state.velocityX *= momentumDecay;
    state.velocityY *= momentumDecay;

    state.momentumId = requestAnimationFrame(applyMomentum);
  }, [momentum, momentumDecay, boundaryElasticity, onScrollEnd]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled || !ref.current) return;

    // Prevent drag on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a, [contenteditable="true"]')) {
      return;
    }

    e.preventDefault();
    const state = dragState.current;
    
    state.isDragging = true;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.scrollLeft = ref.current.scrollLeft;
    state.scrollTop = ref.current.scrollTop;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.lastTime = Date.now();
    state.velocityX = 0;
    state.velocityY = 0;

    // Cancel any ongoing momentum
    if (state.momentumId) {
      cancelAnimationFrame(state.momentumId);
      state.momentumId = null;
    }

    setIsDragging(true);
    onScrollStart?.();

    // Change cursor for entire document during drag
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [disabled, onScrollStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const state = dragState.current;
    if (!state.isDragging || !ref.current) return;

    e.preventDefault();
    
    const currentTime = Date.now();
    const deltaTime = currentTime - state.lastTime;
    
    if (deltaTime > 0) {
      const deltaX = e.clientX - state.lastX;
      const deltaY = e.clientY - state.lastY;
      
      // Calculate velocity for momentum
      state.velocityX = deltaX / deltaTime * 16; // Convert to per-frame velocity
      state.velocityY = deltaY / deltaTime * 16;
    }

    const x = e.clientX - state.startX;
    const y = e.clientY - state.startY;
    
    ref.current.scrollLeft = state.scrollLeft - x;
    ref.current.scrollTop = state.scrollTop - y;

    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.lastTime = currentTime;
  }, []);

  const handleMouseUp = useCallback(() => {
    const state = dragState.current;
    if (!state.isDragging) return;

    state.isDragging = false;
    setIsDragging(false);

    // Restore cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Apply momentum if enabled
    if (momentum && (Math.abs(state.velocityX) > 1 || Math.abs(state.velocityY) > 1)) {
      state.momentumId = requestAnimationFrame(applyMomentum);
    } else {
      onScrollEnd?.();
    }
  }, [momentum, applyMomentum, onScrollEnd]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || !ref.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const state = dragState.current;
    
    state.isDragging = true;
    state.startX = touch.clientX;
    state.startY = touch.clientY;
    state.scrollLeft = ref.current.scrollLeft;
    state.scrollTop = ref.current.scrollTop;
    state.lastX = touch.clientX;
    state.lastY = touch.clientY;
    state.lastTime = Date.now();
    state.velocityX = 0;
    state.velocityY = 0;

    if (state.momentumId) {
      cancelAnimationFrame(state.momentumId);
      state.momentumId = null;
    }

    setIsDragging(true);
    onScrollStart?.();
  }, [disabled, onScrollStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const state = dragState.current;
    if (!state.isDragging || !ref.current || e.touches.length !== 1) return;

    e.preventDefault();
    
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaTime = currentTime - state.lastTime;
    
    if (deltaTime > 0) {
      const deltaX = touch.clientX - state.lastX;
      const deltaY = touch.clientY - state.lastY;
      
      state.velocityX = deltaX / deltaTime * 16;
      state.velocityY = deltaY / deltaTime * 16;
    }

    const x = touch.clientX - state.startX;
    const y = touch.clientY - state.startY;
    
    ref.current.scrollLeft = state.scrollLeft - x;
    ref.current.scrollTop = state.scrollTop - y;

    state.lastX = touch.clientX;
    state.lastY = touch.clientY;
    state.lastTime = currentTime;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const state = dragState.current;
    if (!state.isDragging) return;

    state.isDragging = false;
    setIsDragging(false);

    if (momentum && (Math.abs(state.velocityX) > 1 || Math.abs(state.velocityY) > 1)) {
      state.momentumId = requestAnimationFrame(applyMomentum);
    } else {
      onScrollEnd?.();
    }
  }, [momentum, applyMomentum, onScrollEnd]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set up event listeners
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    // Update scrollable state on content changes
    const resizeObserver = new ResizeObserver(updateScrollable);
    resizeObserver.observe(element);
    updateScrollable();

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      resizeObserver.disconnect();

      // Clean up any ongoing momentum
      const state = dragState.current;
      if (state.momentumId) {
        cancelAnimationFrame(state.momentumId);
      }

      // Restore cursor if component unmounts during drag
      if (state.isDragging) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    updateScrollable,
  ]);

  return {
    ref,
    isDragging,
    isScrollable,
  };
};





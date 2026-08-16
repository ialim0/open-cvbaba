import React, { useEffect, useState, useRef } from 'react';

interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
  showVertical?: boolean;
  showHorizontal?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  containerRef,
  className = '',
  showVertical = true,
  showHorizontal = false,
  autoHide = true,
  autoHideDelay = 1500,
}) => {
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const updateScrollInfo = () => {
    if (!containerRef.current) return;
    
    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    } = containerRef.current;

    setScrollInfo({
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    });

    // Show indicator when scrolling
    if (autoHide) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial update
    updateScrollInfo();

    // Listen for scroll events
    container.addEventListener('scroll', updateScrollInfo, { passive: true });

    // Listen for resize events
    const resizeObserver = new ResizeObserver(updateScrollInfo);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollInfo);
      resizeObserver.disconnect();
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [containerRef, autoHideDelay]);

  const verticalScrollable = scrollInfo.scrollHeight > scrollInfo.clientHeight;
  const horizontalScrollable = scrollInfo.scrollWidth > scrollInfo.clientWidth;

  const verticalThumbHeight = verticalScrollable
    ? Math.max(20, (scrollInfo.clientHeight / scrollInfo.scrollHeight) * scrollInfo.clientHeight)
    : 0;

  const verticalThumbTop = verticalScrollable
    ? (scrollInfo.scrollTop / (scrollInfo.scrollHeight - scrollInfo.clientHeight)) *
      (scrollInfo.clientHeight - verticalThumbHeight)
    : 0;

  const horizontalThumbWidth = horizontalScrollable
    ? Math.max(20, (scrollInfo.clientWidth / scrollInfo.scrollWidth) * scrollInfo.clientWidth)
    : 0;

  const horizontalThumbLeft = horizontalScrollable
    ? (scrollInfo.scrollLeft / (scrollInfo.scrollWidth - scrollInfo.clientWidth)) *
      (scrollInfo.clientWidth - horizontalThumbWidth)
    : 0;

  if (!verticalScrollable && !horizontalScrollable) {
    return null;
  }

  return (
    <>
      {/* Vertical Scroll Indicator */}
      {showVertical && verticalScrollable && (
        <div
          className={`fixed right-2 top-1/2 -translate-y-1/2 w-1 bg-gray-200/60 rounded-full transition-all duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ height: '60%', maxHeight: '400px' }}
        >
          <div
            className="bg-blue-400/80 rounded-full transition-all duration-150 ease-out"
            style={{
              height: `${(verticalThumbHeight / scrollInfo.clientHeight) * 100}%`,
              transform: `translateY(${(verticalThumbTop / scrollInfo.clientHeight) * 100}%)`,
            }}
          />
        </div>
      )}

      {/* Horizontal Scroll Indicator */}
      {showHorizontal && horizontalScrollable && (
        <div
          className={`fixed bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gray-200/60 rounded-full transition-all duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ width: '60%', maxWidth: '400px' }}
        >
          <div
            className="bg-blue-400/80 rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${(horizontalThumbWidth / scrollInfo.clientWidth) * 100}%`,
              transform: `translateX(${(horizontalThumbLeft / scrollInfo.clientWidth) * 100}%)`,
            }}
          />
        </div>
      )}
    </>
  );
};





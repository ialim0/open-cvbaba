// ScrollArea.tsx
import React, { forwardRef } from 'react';

export const ScrollArea = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`overflow-y-auto scrollbar-thin ${className}`} // Add any other styles you need
        {...props}
      >
        {children}
      </div>
    );
  }
);

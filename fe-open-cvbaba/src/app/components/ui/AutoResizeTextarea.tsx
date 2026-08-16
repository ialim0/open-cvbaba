import React, { forwardRef, useImperativeHandle } from 'react';
import { useAutoResize } from '@/app/hooks/useAutoResize';
import { cn } from '../lib/utils';

interface AutoResizeTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  minHeight?: number;
  maxHeight?: number;
  smoothTransition?: boolean;
  onResize?: (height: number) => void;
  showCharCount?: boolean;
  maxLength?: number;
  variant?: 'default' | 'ghost' | 'minimal';
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  (
    {
      className,
      value = '',
      onChange,
      onPaste,
      onInput,
      minHeight = 120,
      maxHeight = 600,
      smoothTransition = true,
      onResize,
      showCharCount = false,
      maxLength,
      variant = 'default',
      placeholder,
      disabled,
      readOnly,
      ...props
    },
    forwardedRef
  ) => {
    const stringValue = String(value || '');
    const { ref: autoResizeRef, onPaste: handleAutoPaste, onInput: handleAutoInput } = useAutoResize(
      stringValue,
      {
        minHeight,
        maxHeight,
        smoothTransition,
        onResize,
        padding: variant === 'minimal' ? 12 : 16,
        borderWidth: variant === 'ghost' ? 0 : 1,
      }
    );

    // Combine refs
    useImperativeHandle(forwardedRef, () => autoResizeRef.current!);

    // Combine event handlers
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      handleAutoPaste(e);
      onPaste?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      handleAutoInput();
      onInput?.(e);
    };

    // Calculate character count
    const charCount = stringValue.length;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    const baseStyles = cn(
      // Base styles
      'w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'transition-all duration-200',
      'focus:outline-none resize-none',
      'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent',

      // Variant styles
      {
        'default': cn(
          'border border-gray-300 dark:border-gray-700 rounded-lg p-4',
          'hover:border-gray-400 dark:hover:border-gray-600 focus:border-gray-500 dark:focus:border-gray-500',
          'focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800',
          'shadow-sm hover:shadow-md focus:shadow-lg'
        ),
        'ghost': cn(
          'border-0 p-3',
          'hover:bg-gray-50/50 dark:hover:bg-gray-800/50 focus:bg-gray-50 dark:focus:bg-gray-800',
          'rounded-lg'
        ),
        'minimal': cn(
          'border-b border-gray-300 dark:border-gray-700 px-0 py-3',
          'hover:border-gray-400 dark:hover:border-gray-600 focus:border-gray-500 dark:focus:border-gray-500',
          'focus:ring-0'
        ),
      }[variant],

      // State styles
      disabled && 'opacity-50 cursor-not-allowed',
      readOnly && 'bg-gray-50 dark:bg-gray-800/50',
      isOverLimit && 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/40',

      className
    );

    return (
      <div className="relative w-full">
        <textarea
          ref={autoResizeRef}
          value={value}
          onChange={onChange}
          onPaste={handlePaste}
          onInput={handleInput}
          className={baseStyles}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            // Ensure smooth font rendering
            fontSmooth: 'always',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            // Better text rendering
            textRendering: 'optimizeLegibility',
            // Prevent layout shift
            lineHeight: '1.5',
            // Mobile optimizations
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          {...props}
        />

        {/* Character count indicator */}
        {showCharCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-2 text-xs font-medium transition-colors duration-200',
              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-gray-400'
            )}
          >
            <span className={cn(
              'tabular-nums',
              isOverLimit && 'font-bold'
            )}>
              {charCount}
            </span>
            <span className="text-gray-400"> / {maxLength}</span>
          </div>
        )}

        {/* Focus indicator line for minimal variant */}
        {variant === 'minimal' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100" />
        )}

        {/* Resize handle indicator (visual only) */}
        <div className="absolute bottom-2 right-2 pointer-events-none opacity-0 transition-opacity duration-200 hover:opacity-100">
          <svg
            className="w-3 h-3 text-gray-300"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path d="M8 8L4 8L8 4L8 8Z" />
            <path d="M8 3L3 8L0 8L0 5L5 0L8 0L8 3Z" opacity="0.5" />
          </svg>
        </div>
      </div>
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';





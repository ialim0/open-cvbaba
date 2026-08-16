import React from 'react';
import { cn } from '../lib/utils';

interface OpenCvbabaLogoProps {
    className?: string;
    variant?: 'black' | 'white' | 'auto';
}

export const OpenCvbabaLogo: React.FC<OpenCvbabaLogoProps> = ({ className, variant = 'auto' }) => {
    return (
        <div className={cn("relative inline-block", className)}>
            {(variant === 'black' || variant === 'auto') && (
                <img
                    src="/images/open-cvbaba-black.png"
                    alt="open-cvbaba Logo"
                    className={cn(
                        "w-full h-full object-contain pointer-events-none",
                        variant === 'auto' ? "block dark:hidden" : "block"
                    )}
                />
            )}
            {(variant === 'white' || variant === 'auto') && (
                <img
                    src="/images/open-cvbaba-white.png"
                    alt="open-cvbaba Logo"
                    className={cn(
                        "w-full h-full object-contain pointer-events-none",
                        variant === 'auto' ? "hidden dark:block" : "block"
                    )}
                />
            )}
        </div>
    );
};

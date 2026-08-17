import React from 'react';
import { cn } from '../lib/utils';

interface OpenCvbabaLogoProps {
    className?: string;
    variant?: 'black' | 'white' | 'auto';
}

/** Canonical open-cvbaba logo asset. The variant prop is retained for API compatibility. */
export const OpenCvbabaLogo: React.FC<OpenCvbabaLogoProps> = ({ className }) => (
    <img
        src="/images/open-cvbaba-logo.png"
        alt="open-cvbaba"
        className={cn("h-full w-full object-contain pointer-events-none", className)}
    />
);

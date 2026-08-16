import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface PageSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    iconBgColor: string; // e.g. 'bg-blue-100 dark:bg-blue-900/30'
    children: React.ReactNode;
    footer?: React.ReactNode;
    disabled?: boolean;
}

/**
 * Unified side-sheet component for page tools.
 * Renders in the sidebar portal, doesn't block PDF preview.
 */
export const PageSheet: React.FC<PageSheetProps> = ({
    isOpen,
    onClose,
    title,
    icon,
    iconBgColor,
    children,
    footer,
    disabled = false,
}) => {
    if (!isOpen) return null;

    const portalTarget = typeof document !== 'undefined'
        ? document.getElementById('sidebar-overlay-portal')
        : null;

    if (!portalTarget) return null;

    return createPortal(
        <div className="absolute inset-x-0 top-0 bottom-24 bg-white dark:bg-gray-900 z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-200 shadow-xl rounded-b-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${iconBgColor}`}>
                        {icon}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    disabled={disabled}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 pb-6">
                    {footer}
                </div>
            )}
        </div>,
        portalTarget
    );
};

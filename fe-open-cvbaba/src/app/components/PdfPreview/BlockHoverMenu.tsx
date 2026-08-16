import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface BlockHoverMenuProps {
    target: HTMLElement | null;
    position: { top: number; left: number } | null;
    onAction: () => void; // call this after action to trigger autosave/update
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const BlockHoverMenu: React.FC<BlockHoverMenuProps> = ({
    target,
    position,
    onAction,
    onMouseEnter,
    onMouseLeave
}) => {
    if (!target || !position) return null;

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Verify element is still connected to DOM
        if (!target.isConnected || !target.parentNode) {
            console.warn('BlockHoverMenu: Target element is no longer connected to DOM');
            return;
        }

        try {
            const clone = target.cloneNode(true) as HTMLElement;
            // Remove highlight class from clone
            clone.classList.remove('block-hover-highlight');
            target.parentNode.insertBefore(clone, target.nextSibling);
            onAction();
        } catch (error) {
            console.error('BlockHoverMenu: Error duplicating element', error);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Verify element is still connected to DOM
        if (!target.isConnected || !target.parentNode) {
            console.warn('BlockHoverMenu: Target element is no longer connected to DOM');
            return;
        }

        try {
            target.remove();
            onAction();
        } catch (error) {
            console.error('BlockHoverMenu: Error deleting element', error);
        }
    };

    return (
        <div
            className="fixed z-50 flex items-center bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-100"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translate(0, -100%) translateY(-8px)', // Position above left
            }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent selection loss or other issues
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <button
                onClick={handleDuplicate}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700"
                title="Duplicate"
            >
                <Copy className="w-4 h-4" />
            </button>
            <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-red-900/30 rounded-r-md text-red-600 dark:text-red-400 hover:text-red-700"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

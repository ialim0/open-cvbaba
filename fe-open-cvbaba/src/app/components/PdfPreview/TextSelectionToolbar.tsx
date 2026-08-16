import React, { useState, useRef, useEffect } from 'react';
// Toolbar for text formatting
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    Type
} from 'lucide-react';

interface TextSelectionToolbarProps {
    shadowRoot: ShadowRoot | null;
    selection: Selection | null;
    position: { top: number; left: number } | null;
    onClose: () => void;
    onAction?: () => void; // Trigger save after formatting
}

// Preset colors for quick selection
const PRESET_COLORS = [
    '#000000', // Black
    '#4B5563', // Gray
    '#EF4444', // Red
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
];

// Font sizes
const FONT_SIZES = [
    { label: '12px', value: '1' },
    { label: '14px', value: '2' },
    { label: '16px', value: '3' },
    { label: '18px', value: '4' },
    { label: '24px', value: '5' },
    { label: '32px', value: '6' },
    { label: '48px', value: '7' },
];

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
    shadowRoot,
    selection,
    position,
    onClose,
    onAction
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const fontSizeRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
                setShowColorPicker(false);
            }
            if (fontSizeRef.current && !fontSizeRef.current.contains(e.target as Node)) {
                setShowFontSizeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!position || !selection || selection.isCollapsed) return null;

    const handleFormat = (command: string, value?: string) => {
        // Ensure the content is focused
        const content = shadowRoot?.querySelector('.document-body') as HTMLElement;
        if (content) content.focus();

        if (shadowRoot) {
            // Bridge the selection from Shadow DOM to Document
            // This is critical because execCommand operates on the main document's selection
            const shadowSelection = (shadowRoot as any).getSelection();

            if (shadowSelection && shadowSelection.rangeCount > 0) {
                try {
                    const shadowRange = shadowSelection.getRangeAt(0);
                    const docSelection = window.getSelection();

                    if (docSelection) {
                        docSelection.removeAllRanges();
                        docSelection.addRange(shadowRange);
                    }
                } catch (e) {
                    console.warn('Could not restore selection:', e);
                }
            }
        }

        // Use modern CSS styles
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand(command, false, value);

        // Trigger save after formatting
        onAction?.();
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        handleFormat('foreColor', color);
        setShowColorPicker(false);
    };

    const handleFontSizeSelect = (value: string) => {
        handleFormat('fontSize', value);
        setShowFontSizeDropdown(false);
    };

    return (
        <div
            className="fixed z-50 flex items-center gap-0.5 p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translate(-50%, -100%) translateY(-12px)',
            }}
            onMouseDown={(e) => e.preventDefault()}
        >
            {/* Font Size Dropdown */}
            <div className="relative" ref={fontSizeRef}>
                <button
                    onClick={() => {
                        setShowFontSizeDropdown(!showFontSizeDropdown);
                        setShowColorPicker(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 text-sm font-medium"
                    title="Font Size"
                >
                    <Type className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                </button>

                {showFontSizeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[80px] z-10">
                        {FONT_SIZES.map((size) => (
                            <button
                                key={size.value}
                                onClick={() => handleFontSizeSelect(size.value)}
                                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Text Formatting Buttons */}
            <button
                onClick={() => handleFormat('bold')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Bold (Ctrl+B)"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('italic')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Italic (Ctrl+I)"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('underline')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Underline (Ctrl+U)"
            >
                <Underline className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('strikeThrough')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Alignment Buttons */}
            <button
                onClick={() => handleFormat('justifyLeft')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('justifyCenter')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('justifyRight')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Color Picker Dropdown */}
            <div className="relative" ref={colorPickerRef}>
                <button
                    onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowFontSizeDropdown(false);
                    }}
                    className="flex items-center gap-1 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Text Color"
                >
                    <div className="relative">
                        <span className="text-lg font-bold text-gray-700 dark:text-gray-300">A</span>
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1 rounded-sm"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showColorPicker && (
                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-10 min-w-[200px]">
                        {/* Preset Colors */}
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Colors</p>
                            <div className="grid grid-cols-9 gap-1">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => handleColorSelect(color)}
                                        className={`w-5 h-5 rounded border-2 transition-transform hover:scale-110 ${selectedColor === color
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Color Picker Input */}
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Color</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) => {
                                        setSelectedColor(e.target.value);
                                    }}
                                    onBlur={(e) => handleColorSelect(e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <input
                                    type="text"
                                    value={selectedColor}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                            setSelectedColor(val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                            handleColorSelect(e.target.value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && /^#[0-9A-Fa-f]{6}$/.test(selectedColor)) {
                                            handleColorSelect(selectedColor);
                                        }
                                    }}
                                    className="flex-1 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import TextArea from '../ui/Textarea';
import { FilePlus, ArrowDown, ArrowUp, Loader2, Sparkles } from 'lucide-react';

interface InsertPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (prompt: string, position: 'before' | 'after') => void;
    pageNumber: number;
    isGenerating: boolean;
}

export const InsertPageModal: React.FC<InsertPageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pageNumber,
    isGenerating,
}) => {
    const [prompt, setPrompt] = useState('');
    const [position, setPosition] = useState<'before' | 'after'>('after');

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        onConfirm(prompt, position);
        setPrompt('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <FilePlus className="h-5 w-5" />
                    <span>{"Insert New Page"}</span>
                </div>
            }
            size="md"
        >
            <div className="p-6 pt-2 space-y-6">
                {/* Position Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {"Position"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPosition('before')}
                            disabled={isGenerating}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${position === 'before'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <ArrowUp className="mb-2 h-5 w-5" />
                            <span className="text-sm font-medium">
                                {"Before Page"} {pageNumber}
                            </span>
                        </button>
                        <button
                            onClick={() => setPosition('after')}
                            disabled={isGenerating}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${position === 'after'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <ArrowDown className="mb-2 h-5 w-5" />
                            <span className="text-sm font-medium">
                                {"After Page"} {pageNumber}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Prompt */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                        <span>{"Page Content Instructions"}</span>
                        <span className="text-xs text-gray-400 font-normal">AI Generated</span>
                    </label>
                    <TextArea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={"Describe what you want on this new page like \"A project timeline section\" or \"A list of references\"..."}
                        className="min-h-[120px] resize-none"
                        disabled={isGenerating}
                    />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isGenerating}
                    >
                        {"Cancel"}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isGenerating || !prompt.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {"Generating..."}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {"Generate"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

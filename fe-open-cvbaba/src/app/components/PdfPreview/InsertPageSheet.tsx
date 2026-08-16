import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { PageSheet } from './PageSheet';
import { Button } from '../ui/Button';
import { FilePlus, ArrowDown, ArrowUp, Loader2, Sparkles } from 'lucide-react';

interface InsertPageSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (prompt: string, position: 'before' | 'after') => void;
    pageNumber: number;
    isGenerating: boolean;
}

export const InsertPageSheet: React.FC<InsertPageSheetProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pageNumber,
    isGenerating,
}) => {
    const { t } = useTranslation('activity');
    const [prompt, setPrompt] = useState('');
    const [position, setPosition] = useState<'before' | 'after'>('after');

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        onConfirm(prompt, position);
        setPrompt('');
    };

    return (
        <PageSheet
            isOpen={isOpen}
            onClose={onClose}
            title={t('pdfPreview.insertPageTitle', { defaultValue: 'Insert Page' })}
            icon={<FilePlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            disabled={isGenerating}
            footer={
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isGenerating}
                        className="flex-1"
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isGenerating || !prompt.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.generating', { defaultValue: 'Creating...' })}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {t('common.generate', { defaultValue: 'Generate' })}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Position Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('pdfPreview.insertPosition', { defaultValue: 'Position' })}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setPosition('before')}
                            disabled={isGenerating}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all text-sm ${position === 'before'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <ArrowUp className="h-4 w-4" />
                            <span className="font-medium">Before {pageNumber}</span>
                        </button>
                        <button
                            onClick={() => setPosition('after')}
                            disabled={isGenerating}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all text-sm ${position === 'after'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <ArrowDown className="h-4 w-4" />
                            <span className="font-medium">After {pageNumber}</span>
                        </button>
                    </div>
                </div>

                {/* Content Prompt */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        {t('pdfPreview.pageContent', { defaultValue: 'AI Content' })}
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('pdfPreview.insertPlaceholder', {
                            defaultValue: 'Describe what to add, e.g. "A project timeline" or "List of references"...'
                        })}
                        className="w-full min-h-[100px] p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isGenerating}
                    />
                </div>
            </div>
        </PageSheet>
    );
};

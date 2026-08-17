import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Download, FileDown, Loader2, Layers, File, Files } from 'lucide-react';

type ExportScope = 'full' | 'single' | 'range';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExportPdf: (scope: ExportScope, singlePage?: number, rangeStart?: number, rangeEnd?: number) => void;
    onExportWord: () => void;
    pageNumber: number;
    pageCount: number;
    isGenerating: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExportPdf,
    onExportWord,
    pageNumber,
    pageCount,
    isGenerating,
}) => {
    const [scope, setScope] = useState<ExportScope>('full');
    const [singlePageInput, setSinglePageInput] = useState(pageNumber);
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(pageCount);

    useEffect(() => {
        setSinglePageInput(pageNumber);
    }, [pageNumber]);

    useEffect(() => {
        setRangeEnd(pageCount);
    }, [pageCount]);

    const handleExportPdf = () => {
        onExportPdf(scope, singlePageInput, rangeStart, rangeEnd);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={"Export Document"}
            ariaLabelledBy="export-modal-title"
            size="md"
        >
            <div className="p-6 space-y-6">
                {/* Scope Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {"Pages to Export"}
                    </label>
                    <div className="space-y-2">
                        {/* Full Document */}
                        <button
                            onClick={() => setScope('full')}
                            disabled={isGenerating}
                            className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${scope === 'full'
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                                }`}
                        >
                            <div className={`p-2 rounded-lg mr-3 ${scope === 'full' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <Files className={`h-4 w-4 ${scope === 'full' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            </div>
                            <div>
                                <div className={`font-medium text-sm ${scope === 'full' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {"All Pages"}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</div>
                            </div>
                        </button>

                        {/* Single Page */}
                        <button
                            onClick={() => setScope('single')}
                            disabled={isGenerating}
                            className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${scope === 'single'
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                                }`}
                        >
                            <div className={`p-2 rounded-lg mr-3 ${scope === 'single' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <File className={`h-4 w-4 ${scope === 'single' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                                <div className={`font-medium text-sm ${scope === 'single' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {"Single Page"}
                                </div>
                            </div>
                            {scope === 'single' && (
                                <Input
                                    type="number"
                                    min={1}
                                    max={pageCount}
                                    value={singlePageInput}
                                    onChange={(e) => setSinglePageInput(Math.max(1, Math.min(parseInt(e.target.value) || 1, pageCount)))}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-16 h-8 text-sm text-center"
                                />
                            )}
                        </button>

                        {/* Page Range */}
                        <button
                            onClick={() => setScope('range')}
                            disabled={isGenerating}
                            className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${scope === 'range'
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                                }`}
                        >
                            <div className={`p-2 rounded-lg mr-3 ${scope === 'range' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <Layers className={`h-4 w-4 ${scope === 'range' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                                <div className={`font-medium text-sm ${scope === 'range' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {"Page Range"}
                                </div>
                            </div>
                            {scope === 'range' && (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={rangeEnd}
                                        value={rangeStart}
                                        onChange={(e) => setRangeStart(Math.max(1, Math.min(parseInt(e.target.value) || 1, rangeEnd)))}
                                        className="w-14 h-8 text-sm text-center"
                                    />
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                                    <Input
                                        type="number"
                                        min={rangeStart}
                                        max={pageCount}
                                        value={rangeEnd}
                                        onChange={(e) => setRangeEnd(Math.max(rangeStart, Math.min(parseInt(e.target.value) || pageCount, pageCount)))}
                                        className="w-14 h-8 text-sm text-center"
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Word Export Option */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => {
                            onExportWord();
                            onClose();
                        }}
                        disabled={isGenerating}
                        className="w-full flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group text-left"
                    >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:scale-105 transition-transform">
                            <FileDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                {"Export as Word"}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isGenerating}
                        className="flex-1"
                    >
                        {"Cancel"}
                    </Button>
                    <Button
                        onClick={handleExportPdf}
                        disabled={isGenerating}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {"Exporting..."}
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                {"Export PDF"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;

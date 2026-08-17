import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download, FileText, FileDown, Loader2 } from 'lucide-react';

interface ExportPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExportPdf: () => void;
    onExportWord: () => void;
    pageNumber: number;
    isGenerating: boolean;
}

export const ExportPageModal: React.FC<ExportPageModalProps> = ({
    isOpen,
    onClose,
    onExportPdf,
    onExportWord,
    pageNumber,
    isGenerating,
}) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Download className="h-5 w-5 text-green-600" />
                    <span>{"Exportpagetitle"}</span>
                </div>
            }
            size="sm"
        >
            <div className="p-6 pt-2 space-y-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {"Choose a format to download this page:"}
                </p>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={onExportPdf}
                        disabled={isGenerating}
                        className="flex items-center p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group text-left"
                    >
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">PDF Document</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Standard Portable Document Format</div>
                        </div>
                    </button>

                    <button
                        onClick={onExportWord}
                        disabled={isGenerating}
                        className="flex items-center p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group text-left"
                    >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                            <FileDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">Word Document</span>
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full uppercase tracking-wider">BETA</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Editable Microsoft Word format</div>
                        </div>
                    </button>
                </div>

                {isGenerating && (
                    <div className="flex items-center justify-center pt-2 text-sm text-gray-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"Generating file..."}
                    </div>
                )}
            </div>
        </Modal>
    );
};

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { Upload, ArrowLeft, ArrowRight, Globe, Loader2, FileText } from 'lucide-react';

interface ImportUploadPageProps {
    onBack: () => void;
    onComplete: (data: {
        extractedText: string;
        documentType: string;
        templateId: string;
        language: string;
        sourceUrl?: string;
    }) => void;
    onFileExtract?: (file: File) => Promise<string>;
}

type ImportMode = 'upload' | 'link';

const ImportUploadPage: React.FC<ImportUploadPageProps> = ({ onBack, onComplete, onFileExtract }) => {
    const { t } = useTranslation('activity');
    const [mode, setMode] = useState<ImportMode>('upload');
    const [isProcessing, setIsProcessing] = useState(false);

    // Upload state
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    // Link state
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        try {
            new URL(inputUrl);
            setIsValidUrl(true);
        } catch {
            setIsValidUrl(false);
        }
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            await processFile(file);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploadedFile(file);
            await processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = async (file: File) => {
        try {
            setIsProcessing(true);

            // Mock processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            const extractedText = 'Content extracted from uploaded file.';

            onComplete({
                extractedText,
                documentType: 'cv',
                templateId: '',
                language: 'en',
            });
        } catch (error) {
            console.error('Error processing file:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImportLink = async () => {
        if (!isValidUrl) return;

        try {
            setIsProcessing(true);

            // Mock processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            const extractedText = `Content imported from ${url}.`;

            onComplete({
                extractedText,
                documentType: 'cv',
                templateId: '',
                language: 'en',
                sourceUrl: url
            });
        } catch (error) {
            console.error('Error importing from URL:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 sm:p-8">
            <div className="w-full max-w-xl space-y-8">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        {t('activity_chat.import.title', { defaultValue: 'Import Content' })}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {t('activity_chat.import.description', { defaultValue: 'Upload a file or paste a URL to get started.' })}
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                        onClick={() => setMode('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'upload'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        {t('activity_chat.import.upload_tab', { defaultValue: 'Upload File' })}
                    </button>
                    <button
                        onClick={() => setMode('link')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'link'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        {t('activity_chat.import.link_tab', { defaultValue: 'From Link' })}
                    </button>
                </div>

                {/* Processing State */}
                {isProcessing && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {mode === 'upload'
                                ? t('activity_chat.upload.processing', { defaultValue: 'Processing your document...' })
                                : t('activity_chat.import.importing', { defaultValue: 'Importing...' })
                            }
                        </p>
                        {uploadedFile && <p className="text-sm text-gray-400">{uploadedFile.name}</p>}
                    </div>
                )}

                {/* Upload Mode */}
                {!isProcessing && mode === 'upload' && (
                    <div className="space-y-4">
                        <input
                            type="file"
                            ref={uploadInputRef}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                        />
                        <div
                            onClick={() => uploadInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
                                }`}
                        >
                            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                                <FileText className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                {t('activity_chat.upload.drag_drop', { defaultValue: 'Drag and drop your file here' })}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('activity_chat.upload.or_browse', { defaultValue: 'or click to browse' })}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                                {t('activity_chat.upload.supported_formats', { defaultValue: 'PDF, DOC, DOCX, TXT' })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Link Mode */}
                {!isProcessing && mode === 'link' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="https://linkedin.com/in/your-profile"
                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-lg"
                            />
                        </div>
                        {!isValidUrl && url.length > 0 && (
                            <p className="text-red-500 text-sm ml-1">
                                {t('activity_chat.import.invalid_url', { defaultValue: 'Please enter a valid URL.' })}
                            </p>
                        )}
                        <button
                            onClick={handleImportLink}
                            disabled={!isValidUrl}
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isValidUrl
                                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {t('activity_chat.import.continue', { defaultValue: 'Continue' })}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportUploadPage;

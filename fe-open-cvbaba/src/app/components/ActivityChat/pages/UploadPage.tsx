import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';

interface UploadPageProps {
    onBack: () => void;
    onComplete: (data: {
        extractedText: string;
        documentType: string;
        templateId: string;
        language: string;
    }) => void;
    onFileExtract: (file: File) => Promise<string>;
}

const UploadPage: React.FC<UploadPageProps> = ({ onBack, onComplete, onFileExtract }) => {
    const { t } = useTranslation('activity');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const hasTriggeredUpload = useRef(false);

    // Auto-trigger file upload when component mounts (only once)
    useEffect(() => {
        if (!hasTriggeredUpload.current && uploadInputRef.current) {
            hasTriggeredUpload.current = true;
            uploadInputRef.current.click();
        }
    }, []);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            await extractTextFromFile(file);
        } else {
            // If user cancels file selection, go back
            onBack();
        }
    };

    const extractTextFromFile = async (file: File) => {
        try {
            setIsUploading(true);

            // Mock response (API disabled)
            await new Promise(resolve => setTimeout(resolve, 1500));
            const extractedText = 'This is a placeholder text since the extraction API is currently disabled. The file was processed successfully.';

            // Immediately complete with default values
            onComplete({
                extractedText,
                documentType: 'cv',
                templateId: '',
                language: 'en-US',
            });
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Failed to process the document. Please try again.');
            onBack();
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
            {/* Hidden file input */}
            <input
                type="file"
                ref={uploadInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
            />

            {/* Loading state while uploading */}
            {isUploading && (
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {t('activity_chat.upload.processing', { defaultValue: 'Processing your document...' })}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {uploadedFile?.name}
                        </p>
                    </div>
                </div>
            )}

            {/* Initial state (before file is selected, shown briefly or if dialog is slow) */}
            {!isUploading && !uploadedFile && (
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <button
                        onClick={onBack}
                        className="absolute top-5 left-5 p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {t('activity_chat.upload.select_file', { defaultValue: 'Select a file to upload' })}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('activity_chat.upload.supported_formats', { defaultValue: 'Supports PDF, DOC, DOCX, TXT' })}
                        </p>
                    </div>
                    <button
                        onClick={() => uploadInputRef.current?.click()}
                        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        {t('activity_chat.upload.browse_files', { defaultValue: 'Browse Files' })}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;

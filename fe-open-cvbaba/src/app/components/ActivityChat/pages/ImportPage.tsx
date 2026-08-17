import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { ArrowLeft, ArrowRight, Globe, Loader2 } from 'lucide-react';

interface ImportPageProps {
    onBack: () => void;
    onComplete: (data: {
        extractedText: string;
        documentType: string;
        templateId: string;
        language: string;
        sourceUrl: string;
    }) => void;
}

const ImportPage: React.FC<ImportPageProps> = ({ onBack, onComplete }) => {
    const { t } = useTranslation('activity');
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        // Basic URL validation
        try {
            new URL(inputUrl);
            setIsValidUrl(true);
        } catch {
            setIsValidUrl(false);
        }
    };

    const handleImport = async () => {
        if (!isValidUrl) return;

        try {
            setIsImporting(true);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockExtractedText = `Content imported from ${url}. This is a placeholder for the actual content extraction.`;

            // Immediately complete with default values
            onComplete({
                extractedText: mockExtractedText,
                documentType: 'cv',
                templateId: '',
                language: 'en',
                sourceUrl: url
            });
        } catch (error) {
            console.error('Error importing from URL:', error);
        } finally {
            setIsImporting(false);
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
                        {t('activity_chat.import.title', { defaultValue: 'Import from Link' })}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {t('activity_chat.import.description', { defaultValue: 'Paste a URL (YouTube, LinkedIn, website) to create a document from its content.' })}
                    </p>
                </div>

                {/* URL Input */}
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
                        <p className="text-red-500 text-sm ml-1">{t('activity_chat.import.invalid_url', { defaultValue: 'Please enter a valid URL.' })}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleImport}
                    disabled={!isValidUrl || isImporting}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isValidUrl && !isImporting
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20'
                        : isImporting
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 cursor-wait'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isImporting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('activity_chat.import.importing', { defaultValue: 'Importing...' })}
                        </>
                    ) : (
                        <>
                            {t('activity_chat.import.continue', { defaultValue: 'Continue' })}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImportPage;

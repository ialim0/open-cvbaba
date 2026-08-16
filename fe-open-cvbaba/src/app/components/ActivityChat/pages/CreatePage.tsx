import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { ArrowLeft, Check } from 'lucide-react';
import TemplateSelector from '../TemplateSelector';
import { templates } from '../data/templates';
import { languageOptions, getLanguageShortName } from '@/app/config/languages';

interface CreatePageProps {
    onSelectOption: (option: string) => void;
    onBack: () => void;
}

const CreatePage: React.FC<CreatePageProps> = ({ onSelectOption, onBack }) => {
    const { t } = useTranslation('activity');
    const [step, setStep] = useState<'template' | 'language'>('template');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

    const getStepNumber = () => {
        return step === 'template' ? 1 : 2;
    };

    const handleBack = () => {
        if (step === 'language') {
            setStep('template');
        } else {
            onBack();
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId);
        setStep('language');
    };

    const handleLanguageSelect = (languageValue: string) => {
        setSelectedLanguage(languageValue);
        // Navigate to prompt mode with selected template and language
        // The template ID and language will be passed through URL params
        onSelectOption(`cv?templateId=${selectedTemplateId}&language=${languageValue}`);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3 text-sm">
                {[
                    { num: 1, label: t('activity_chat.steps.template') || 'Template' },
                    { num: 2, label: t('activity_chat.steps.language') || 'Language' }
                ].map((s, index) => (
                    <React.Fragment key={s.num}>
                        {index > 0 && <div className={`w-8 h-px ${getStepNumber() > index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${getStepNumber() > s.num
                                ? 'bg-blue-600 text-white'
                                : getStepNumber() === s.num
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                {getStepNumber() > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                            </div>
                            <span className={`hidden sm:inline ${getStepNumber() >= s.num ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <StepIndicator />

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-700 p-6 sm:p-10 relative overflow-hidden transition-colors">
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-100/50 dark:from-gray-700/30 to-transparent rounded-bl-full pointer-events-none" />

                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="absolute top-5 left-5 sm:top-6 sm:left-6 p-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-10"
                        title={t('activity_chat.common.back_to_menu') || 'Back'}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Template Selection */}
                    {step === 'template' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    {t('activity_chat.create.title') || 'Choose Template'}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                                    {t('activity_chat.create.description') || 'Select a template to get started.'}
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <TemplateSelector
                                    templates={templates}
                                    selectedTemplateId={selectedTemplateId}
                                    onSelectTemplate={handleTemplateSelect}
                                />
                            </div>
                        </div>
                    )}

                    {/* Language Selection */}
                    {step === 'language' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    {t('activity_chat.upload.title_language') || 'Select Language'}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                                    {t('activity_chat.upload.language_description') || 'Choose the language for your document.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleLanguageSelect(option.value)}
                                        className={`px-4 py-3 text-left rounded-lg border-2 transition-all ${selectedLanguage === option.value
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${selectedLanguage === option.value ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'}`}>{getLanguageShortName(option.value)}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.region}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePage;

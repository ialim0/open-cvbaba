import React, { useMemo, useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { ArrowLeft, Check, FileText, Mail } from 'lucide-react';
import TemplateSelector from '../TemplateSelector';
import { templates } from '../data/templates';
import { languageOptions, getLanguageShortName } from '@/app/config/languages';

type DocumentType = 'cv' | 'cover-letter';

interface CreatePageProps {
    onComplete: (data: { documentType: DocumentType; templateId: string; language: string }) => void;
    onBack: () => void;
    initialDocumentType?: DocumentType;
}

const CreatePage: React.FC<CreatePageProps> = ({ onComplete, onBack, initialDocumentType = 'cv' }) => {
    const { t } = useTranslation('activity');
    const [documentType, setDocumentType] = useState<DocumentType>('cv');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const availableTemplates = useMemo(
        () => templates.filter((template) => template.type === (documentType === 'cv' ? 'CV' : 'Letter')),
        [documentType],
    );

    const handleDocumentTypeChange = (nextType: DocumentType) => {
        setDocumentType(nextType);
        setSelectedTemplateId('');
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    {t('common.back', { defaultValue: 'Back' })}
                </button>

                <header className="mb-8">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-600">
                        {t('activity_chat.create.eyebrow', { defaultValue: 'Create a document' })}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t('activity_chat.create.title', { defaultValue: 'Choose a document type' })}
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {t('activity_chat.create.description', { defaultValue: 'Choose CV or cover letter, then optionally start from a template.' })}
                    </p>
                </header>

                <section aria-labelledby="document-type-heading" className="mb-8">
                    <h2 id="document-type-heading" className="sr-only">Document type</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {([
                            { id: 'cv' as const, title: 'CV / Resume', description: 'Highlight your experience, skills, and achievements.', icon: FileText },
                            { id: 'cover-letter' as const, title: 'Cover Letter', description: 'Write a focused letter for a specific opportunity.', icon: Mail },
                        ]).map(({ id, title, description, icon: Icon }) => {
                            const selected = documentType === id;
                            return (
                                <button key={id} type="button" onClick={() => handleDocumentTypeChange(id)} className={`rounded-2xl border p-5 text-left transition-colors ${selected ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30' : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`rounded-xl p-3 ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                                                {selected && <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('activity_chat.create.template_title', { defaultValue: 'Choose a template (optional)' })}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('activity_chat.create.template_description', { defaultValue: 'Start from a proven layout, or continue without one.' })}
                        </p>
                    </div>

                    <TemplateSelector
                        templates={availableTemplates}
                        selectedTemplateId={selectedTemplateId}
                        onSelectTemplate={(templateId) => setSelectedTemplateId(selectedTemplateId === templateId ? '' : templateId)}
                    />

                    <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">{t('activity_chat.create.language', { defaultValue: 'Document language' })}</span>
                            <select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                {languageOptions.map((option) => <option key={option.value} value={option.value}>{getLanguageShortName(option.value)}</option>)}
                            </select>
                        </label>
                        <button type="button" onClick={() => onComplete({ documentType, templateId: selectedTemplateId, language: selectedLanguage })} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                            {t('activity_chat.create.continue', { defaultValue: 'Continue' })}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CreatePage;

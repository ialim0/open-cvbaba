import React from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { ArrowLeft, FileText, BookOpen, Briefcase, GraduationCap, Scale, FileCheck, Presentation, BarChart3, BookMarked, Image, FileSignature, Users, Zap, PenTool, ScrollText } from 'lucide-react';

interface DocumentTypePageProps {
    onSelectType: (type: string) => void;
    onBack: () => void;
}

// Document type definitions with icons and descriptions
const documentTypes = [
    // Popular
    { id: 'poster', icon: Image, labelKey: 'documentTypes.poster.label', descriptionKey: 'documentTypes.poster.description', defaultLabel: 'Poster', defaultDescription: 'Research or promotional posters', badge: 'popular' },
    { id: 'ebook', icon: BookOpen, labelKey: 'documentTypes.ebook.label', descriptionKey: 'documentTypes.ebook.description', defaultLabel: 'Ebook', defaultDescription: 'Digital books and guides', badge: 'popular' },
    { id: 'proposal', icon: FileSignature, labelKey: 'documentTypes.proposal.label', descriptionKey: 'documentTypes.proposal.description', defaultLabel: 'Proposal', defaultDescription: 'Business or project proposals', badge: 'popular' },
    { id: 'presentation', icon: Presentation, labelKey: 'documentTypes.presentation.label', descriptionKey: 'documentTypes.presentation.description', defaultLabel: 'Presentation', defaultDescription: 'Slides for presentations and pitches', badge: 'popular' },

    // Best
    { id: 'cv_resume', icon: FileText, labelKey: 'documentTypes.cv.label', descriptionKey: 'documentTypes.cv.description', defaultLabel: 'CV / Resume', defaultDescription: 'Professional resume to showcase your experience', badge: 'best' },
    { id: 'cover_letter', icon: PenTool, labelKey: 'documentTypes.coverLetter.label', descriptionKey: 'documentTypes.coverLetter.description', defaultLabel: 'Cover Letter', defaultDescription: 'Compelling letter for job applications', badge: 'best' },
    { id: 'statement_of_purpose', icon: ScrollText, labelKey: 'documentTypes.sop.label', descriptionKey: 'documentTypes.sop.description', defaultLabel: 'Statement of Purpose', defaultDescription: 'Personal statement for academic applications', badge: 'best' },
    { id: 'scholarship_essay', icon: GraduationCap, labelKey: 'documentTypes.scholarshipEssay.label', descriptionKey: 'documentTypes.scholarshipEssay.description', defaultLabel: 'Scholarship Essay', defaultDescription: 'Essays for scholarship applications', badge: 'best' },

    // New
    { id: 'report', icon: BarChart3, labelKey: 'documentTypes.report.label', descriptionKey: 'documentTypes.report.description', defaultLabel: 'Report', defaultDescription: 'Business, research, or technical reports', badge: 'new' },
    { id: 'carousel', icon: FileCheck, labelKey: 'documentTypes.carousel.label', descriptionKey: 'documentTypes.carousel.description', defaultLabel: 'Carousel', defaultDescription: 'Social media carousels and slides', badge: 'new' },
    { id: 'business_plan', icon: Briefcase, labelKey: 'documentTypes.businessPlan.label', descriptionKey: 'documentTypes.businessPlan.description', defaultLabel: 'Business Plan', defaultDescription: 'Strategic business plans and models', badge: 'new' },
    { id: 'other', icon: Briefcase, labelKey: 'documentTypes.other.label', descriptionKey: 'documentTypes.other.description', defaultLabel: 'Other Document', defaultDescription: 'Any other type of professional document', badge: 'new' },
];

const DocumentTypePage: React.FC<DocumentTypePageProps> = ({ onSelectType, onBack }) => {
    const { t } = useTranslation('activity');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 p-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-10"
                        title={t('common.back', { defaultValue: 'Back' })}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {t('documentTypePage.title', { defaultValue: 'What would you like to create?' })}
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('documentTypePage.description', { defaultValue: 'Choose the type of document you want to create' })}
                    </p>
                </div>

                {/* Document Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documentTypes.map((docType) => {
                        const IconComponent = docType.icon;
                        return (
                            <button
                                key={docType.id}
                                onClick={() => onSelectType(docType.id)}
                                className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${(docType as any).badge ? 'ring-1 ring-blue-500/20 dark:ring-blue-500/10' : ''
                                    }`}
                            >
                                {(docType as any).badge && (
                                    <div className="absolute top-3 right-3">
                                        {(docType as any).badge === 'popular' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                                {t('common.popular', { defaultValue: 'Popular' })}
                                            </span>
                                        )}
                                        {(docType as any).badge === 'best' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                                                {t('common.best', { defaultValue: 'Best' })}
                                            </span>
                                        )}
                                        {(docType as any).badge === 'new' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                                                {t('common.new', { defaultValue: 'New' })}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-50 dark:group-hover:from-blue-900/40 dark:group-hover:to-blue-800/30 transition-all duration-200">
                                        <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {t(docType.labelKey, { defaultValue: docType.defaultLabel })}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {t(docType.descriptionKey, { defaultValue: docType.defaultDescription })}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DocumentTypePage;

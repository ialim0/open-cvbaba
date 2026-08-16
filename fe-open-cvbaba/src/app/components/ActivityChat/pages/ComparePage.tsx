import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { GitCompare, Upload, FileText, Mail, GraduationCap, Award, User, FileSignature, ArrowLeft, ArrowRight, Check, CloudUpload, Sparkles } from 'lucide-react';

interface ComparePageProps {
    onBack: () => void;
}

const ComparePage: React.FC<ComparePageProps> = ({ onBack }) => {
    const { t } = useTranslation('activity');
    const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const options = [
        { id: 'cv', label: 'CV/Resume', icon: FileText, description: 'Compare your resume against industry standards' },
        { id: 'cover-letter', label: 'Cover Letter', icon: Mail, description: 'Evaluate your cover letter against successful examples' },
        { id: 'personal-statement', label: 'Personal Statement', icon: User, description: 'Assess your personal statement\'s impact and tone' },
        { id: 'recommendation', label: 'Recommendation Letter', icon: Award, description: 'Compare endorsement strength with professional norms' },
        { id: 'proposal', label: 'Business Proposal', icon: FileSignature, description: 'Measure your proposal against winning business bids' },
    ];

    const getStepNumber = () => {
        if (!selectedDocumentType) return 1;
        return 2;
    };

    // Step indicator component
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3 text-sm">
                {[
                    { num: 1, label: t('activity_chat.steps.document_type') },
                    { num: 2, label: t('activity_chat.steps.upload_compare') },
                    { num: 3, label: t('activity_chat.steps.results') }
                ].map((step, index) => (
                    <React.Fragment key={step.num}>
                        {index > 0 && <div className={`w-8 h-px ${getStepNumber() > index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${getStepNumber() >= step.num ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                {getStepNumber() > step.num ? <Check className="w-4 h-4" /> : step.num}
                            </div>
                            <span className={`hidden sm:inline ${getStepNumber() >= step.num ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                                {step.label}
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

                    <button
                        onClick={selectedDocumentType ? () => setSelectedDocumentType(null) : onBack}
                        className="absolute top-5 left-5 sm:top-6 sm:left-6 p-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-10"
                        title={t('activity_chat.common.back')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8 relative">


                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {selectedDocumentType
                                ? t('activity_chat.compare.title_type', { type: options.find(o => o.id === selectedDocumentType) ? t(`activity_chat.document_types.${selectedDocumentType.replace(/-/g, '_')}`) : '' })
                                : t('activity_chat.compare.title_initial')}
                        </h1>

                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            {selectedDocumentType
                                ? t('activity_chat.compare.subtitle_type')
                                : t('activity_chat.compare.subtitle_initial')}
                        </p>
                    </div>

                    {!selectedDocumentType ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {options.map((option, index) => {
                                const Icon = option.icon;
                                const isHovered = hoveredOption === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedDocumentType(option.id)}
                                        onMouseEnter={() => setHoveredOption(option.id)}
                                        onMouseLeave={() => setHoveredOption(null)}
                                        className="group p-4 sm:p-5 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 animate-fade-in-up min-h-[100px]"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-blue-600 scale-110' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                <Icon className={`w-5 h-5 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5 flex items-center gap-1.5 text-base sm:text-lg">
                                                    {t(`activity_chat.document_types.${option.id.replace(/-/g, '_')}`)}
                                                    <ArrowRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-300 ${isHovered ? 'translate-x-0.5 text-blue-600' : ''}`} />
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{t(`activity_chat.compare.types.${option.id.replace(/-/g, '_')}`)}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-xl mx-auto">
                            {/* Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('activity_chat.analyze.title_upload', { type: selectedDocumentType ? t(`activity_chat.document_types.${selectedDocumentType.replace(/-/g, '_')}`) : '' })}
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 sm:p-10 text-center hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                                    <CloudUpload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-1"><span className="font-semibold">{t('activity_chat.common.upload_drag').split(' ')[0]}</span> {t('activity_chat.common.upload_drag').split(' ').slice(1).join(' ')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('activity_chat.common.upload_formats')}</p>
                                </div>
                            </div>

                            {/* VS Divider */}
                            <div className="flex items-center justify-center py-2">
                                <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                                <span className="px-4 text-gray-400 dark:text-gray-500 font-bold text-sm tracking-widest">{t('activity_chat.compare.vs')}</span>
                                <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* Benchmark Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('activity_chat.compare.benchmark_label')}
                                </label>
                                <select
                                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 transition-all bg-white dark:bg-gray-800"
                                    style={{ colorScheme: 'light dark' }}
                                >
                                    <option value="">{t('activity_chat.compare.benchmark_placeholder')}</option>
                                    <option value="tech">Tech Industry</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="engineering">Engineering</option>
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('activity_chat.compare.experience_label')}
                                </label>
                                <select
                                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 transition-all bg-white dark:bg-gray-800"
                                    style={{ colorScheme: 'light dark' }}
                                >
                                    <option value="">{t('activity_chat.compare.experience_placeholder')}</option>
                                    <option value="entry">Entry Level (0-2 years)</option>
                                    <option value="mid">Mid Level (3-5 years)</option>
                                    <option value="senior">Senior Level (6-10 years)</option>
                                    <option value="executive">Executive (10+ years)</option>
                                </select>
                            </div>

                            {/* Action Button */}
                            <button className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                <Sparkles className="w-5 h-5" />
                                {t('activity_chat.compare.button_compare')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparePage;

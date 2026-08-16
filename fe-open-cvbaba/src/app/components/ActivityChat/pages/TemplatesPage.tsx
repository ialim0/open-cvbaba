import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import {
    Grid3X3, X, Eye, Check, ArrowLeft, Search,
    FileText, Mail, GraduationCap, User, Award, FileSignature,
    LayoutGrid, Filter, Sparkles, Zap,
    Crown
} from 'lucide-react';
import { templates, Template } from '../data/templates';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import TemplatePreview to avoid SSR issues
const TemplatePreview = dynamic(() => import('../templates/TemplatePreview'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-50 dark:bg-gray-800 animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-500">Loading...</div>
});

interface TemplatesPageProps {
    onSelectTemplate: (templateId: string) => void;
    onBack: () => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ onSelectTemplate, onBack }) => {
    const { t } = useTranslation('activity');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const categoryOptions = [
        { id: 'all', label: t('activity_chat.templates.all_templates'), icon: LayoutGrid },
        { id: 'cv', label: t('activity_chat.document_types.cv'), icon: FileText },
        { id: 'cover-letter', label: t('activity_chat.document_types.cover_letter'), icon: Mail },
        { id: 'personal-statement', label: t('activity_chat.document_types.personal_statement'), icon: User },
        { id: 'recommendation', label: t('activity_chat.document_types.recommendation'), icon: Award },
        { id: 'proposal', label: t('activity_chat.document_types.proposal'), icon: FileSignature },
    ];

    const filteredTemplates = useMemo(() => {
        let filtered = templates;

        // Filter by Category
        if (selectedCategory !== 'all') {
            if (selectedCategory === 'cv') {
                filtered = filtered.filter(t => t.type === 'CV');
            } else {
                // Approximate mapping for other categories based on existing logic
                // In a real app, templates would have a precise 'categoryId' field
                // For now, mapping everything else to 'Letter' type, or matching logic if added later.
                // Assuming 'Letter' handles most text documents currently.
                filtered = filtered.filter(t => t.type === 'Letter');
            }
        }

        // Filter by Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(query) ||
                (t.description?.toLowerCase().includes(query)) ||
                (t.category?.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [selectedCategory, searchQuery]);

    return (
        <div className="flex h-full bg-gray-50/50 dark:bg-gray-950 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                        {t('activity_chat.templates.title')}
                    </h2>
                    <button onClick={onBack} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {categoryOptions.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                                {category.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        {t('activity_chat.templates.available_templates_plural', { count: templates.length })}
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Header / Top Bar */}
                <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-10 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('activity_chat.templates.title')}</h1>
                        </div>

                        <div className="relative w-full max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-gray-100 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('activity_chat.templates.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-gray-700/50"
                            />
                        </div>

                        {/* Mobile Category Scroll */}
                        <div className="flex lg:hidden w-full overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
                            {categoryOptions.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {t('activity_chat.templates.no_results')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    {t('activity_chat.templates.try_adjusting')}
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                    className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredTemplates.map((template, index) => (
                                    <TemplateCard
                                        key={template.id}
                                        template={template}
                                        onClick={() => setSelectedTemplate(template)}
                                        onSelect={() => onSelectTemplate(template.id)}
                                        t={t}
                                        index={index}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedTemplate && (
                    <TemplateModal
                        template={selectedTemplate}
                        onClose={() => setSelectedTemplate(null)}
                        onSelect={() => onSelectTemplate(selectedTemplate.id)}
                        t={t}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components

const TemplateCard = ({ template, onClick, onSelect, t, index }: {
    template: Template;
    onClick: () => void;
    onSelect: () => void;
    t: any;
    index: number;
}) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={onClick}
        className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-blue-600/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
        {/* Aspect Ratio Container */}
        <div className="relative aspect-[1/1.4] bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                {template.hasComponent ? (
                    <div className="w-full h-full transform scale-[0.4] origin-top-left" style={{ width: '250%', height: '250%' }}>
                        <TemplatePreview templateId={template.id} scale={1} />
                    </div>
                ) : (
                    <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover object-top"
                    />
                )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] p-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    className="w-full py-3 bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 rounded-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-100 active:scale-95"
                >
                    {t('activity_chat.templates.use_template')}
                </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
                {false && (
                    <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-md shadow-sm flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {t('activity_chat.templates.premium')}
                    </span>
                )}
            </div>
            <div className="absolute top-3 right-3">
                <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-900 dark:text-gray-100 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 border-t border-gray-50 dark:border-gray-700 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1 truncate">{template.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{template.description}</p>

            <div className="flex items-center gap-2 mt-auto">
                <span className="px-2 py-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider font-semibold rounded-md border border-gray-100 dark:border-gray-800">
                    {template.category || t('activity_chat.templates.type')}
                </span>
                <span className="px-2 py-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider font-semibold rounded-md border border-gray-100 dark:border-gray-800">
                    A4
                </span>
            </div>
        </div>
    </motion.div>
);

const TemplateModal = ({ template, onClose, onSelect, t }: { template: Template; onClose: () => void; onSelect: () => void; t: any }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden transition-colors"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors text-gray-900 dark:text-gray-100"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Left: Preview */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 overflow-y-auto flex items-start justify-center transition-colors">
                <div className="bg-white dark:bg-gray-900 shadow-2xl w-full max-w-[210mm] aspect-[210/297] rounded-sm overflow-hidden ring-1 ring-gray-900/5 dark:ring-white/10">
                    {template.hasComponent ? (
                        <div className="w-full h-full">
                            <TemplatePreview templateId={template.id} scale={1} />
                        </div>
                    ) : (
                        <img src={template.imageUrl} alt={template.name} className="w-full h-full object-contain" />
                    )}
                </div>
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col p-6 lg:p-8 transition-colors">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        {false && (
                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold rounded-full border border-yellow-200 dark:border-yellow-800">
                                {t('activity_chat.templates.premium')}
                            </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full uppercase">
                            {template.category}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{template.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{template.description}</p>
                </div>

                <div className="space-y-6 mb-8 flex-1 overflow-y-auto">
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-3">
                            {t('activity_chat.templates.key_features')}
                        </h4>
                        <ul className="space-y-2.5">
                            {(template.characteristics || [
                                "ATS-Optimized Formatting",
                                "Professional Typography",
                                "Clean & Minimalist Design",
                                "Easy to Read Layout"
                            ]).map((char, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                                    <span>{char}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onSelect}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    {t('activity_chat.templates.use_template')}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

export default TemplatesPage;

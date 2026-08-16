import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { Sparkles, LayoutTemplate, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
    userName?: string;
    onOptionSelect: (option: 'create_mode' | 'templates') => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ userName, onOptionSelect }) => {
    const { t } = useTranslation('activity');
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const options = [
        {
            id: 'create_mode' as const,
            icon: Sparkles,
            title: t('activity_chat.options.create.title', { defaultValue: 'Create' }),
            description: t('activity_chat.options.create.description', { defaultValue: 'Describe what you need — attach files or links for context.' }),
        },
        {
            id: 'templates' as const,
            icon: LayoutTemplate,
            title: t('activity_chat.options.templates.title', { defaultValue: 'Templates' }),
            description: t('activity_chat.options.templates.description', { defaultValue: 'Start with proven formats used by top companies.' }),
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 sm:p-8 lg:p-12">
            {/* Hero Section */}
            <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
                {userName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
                        {t('activity_chat.welcome_back', { name: userName, defaultValue: `Welcome back, ${userName}` })}
                    </p>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {t('activity_chat.hero_title', { defaultValue: 'Build documents that get results' })}
                </h1>

                <p className="text-lg text-gray-500 dark:text-gray-400">
                    {t('activity_chat.hero_subtitle', { defaultValue: 'CVs that land interviews. Proposals that close deals.' })}
                </p>
            </div>

            {/* Options - 2 Column Layout */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-5">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isHovered = hoveredOption === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onOptionSelect(option.id)}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            className={`group relative flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-200 ease-out ${isHovered
                                ? 'border-blue-300 dark:border-blue-700 shadow-xl shadow-blue-500/10 scale-[1.02] -translate-y-1'
                                : 'border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200 ${isHovered
                                ? 'bg-blue-600 text-white scale-110'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                <Icon className="w-7 h-7" strokeWidth={1.5} />
                            </div>

                            <h3 className={`text-lg font-semibold mb-2 transition-colors ${isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                                }`}>
                                {option.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {option.description}
                            </p>

                            <ArrowRight className={`mt-5 w-5 h-5 transition-all duration-200 ${isHovered
                                ? 'opacity-100 translate-y-0 text-blue-600 dark:text-blue-400'
                                : 'opacity-0 translate-y-2 text-gray-400'
                                }`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WelcomePage;

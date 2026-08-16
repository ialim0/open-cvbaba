import React from 'react';
import { useTranslation } from '@/app/i18n/i18n';

interface EnhancementPromptsProps {
  onTranslateClick: () => void;
  onATSClick: () => void;
  onStyleClick: () => void;
  onJustifyClick: () => void;
  onImageClick: () => void;
}

const EnhancementPrompts: React.FC<EnhancementPromptsProps> = ({
  onTranslateClick,
  onATSClick,
  onStyleClick,
  onJustifyClick,
  onImageClick,
}) => {
  const { t } = useTranslation('activity');

  const enhancements = [
    {
      label: t('activityForm.translate'),
      onClick: onTranslateClick,
    },
    {
      label: t('activityForm.ats'),
      onClick: onATSClick,
    },
    {
      label: t('activityForm.style'),
      onClick: onStyleClick,
    },
    {
      label: t('activityForm.justify'),
      onClick: onJustifyClick,
    },
    {
      label: t('activityForm.image'),
      onClick: onImageClick,
    },
  ];


  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800 transition-colors"></div>
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 transition-colors">
          {t('activityForm.enhancementOptions')}
        </span>
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800 transition-colors"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {enhancements.map((enhancement) => (
          <button
            key={enhancement.label}
            type="button"
            onClick={enhancement.onClick}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {enhancement.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnhancementPrompts;
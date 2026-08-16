// src/components/PromptTemplateSelector.tsx
import React from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { PromptTemplate, usePromptTemplates } from './data/promptTemplates';

interface PromptTemplateSelectorProps {
  category: 'resume' | 'cover-letter' | 'all' | 'optimization';
  onSelectTemplate: (template: PromptTemplate) => void;
}

const PromptTemplateSelector: React.FC<PromptTemplateSelectorProps> = ({
  category,
  onSelectTemplate 
}) => {
  const { t } = useTranslation('activity');
  const promptTemplates = usePromptTemplates();
  
  const filteredTemplates = category === 'all'
    ? promptTemplates.filter(t => t.category !== 'optimization')
    : promptTemplates.filter(t => t.category === category);

  // Show only the first 3 templates
  const displayedTemplates = filteredTemplates.slice(0, 3);

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-medium text-gray-700">
        {displayedTemplates.length > 0
          ? t('selector.getStartedPrompt')
          : t('selector.noSuggestions')}
      </h3>
      
      {displayedTemplates.length > 0 && (
        <div className="flex flex-col space-y-2">
          {displayedTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-md p-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onClick={() => onSelectTemplate(template)}
              role="button"
              tabIndex={0}
              aria-label={`Select template: ${template.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectTemplate(template);
                }
              }}
            >
              <div className="w-full overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {template.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {displayedTemplates.length === 0 && (
        <div className="bg-gray-50 rounded-md p-2 text-center">
          <p className="text-sm text-gray-500">{t('selector.tryDifferentCategory')}</p>
        </div>
      )}
    </div>
  );
};

export default PromptTemplateSelector;
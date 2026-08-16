// components/TemplateFilterButtons.tsx
import React from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { Button } from '../ui/Button';
import { Grid3X3, FileText, Mail } from 'lucide-react';

interface TemplateFilterButtonsProps {
  templateFilter: 'all' | 'cv' | 'fl';
  setTemplateFilter: (filter: 'all' | 'cv' | 'fl') => void;
}

const TemplateFilterButtons: React.FC<TemplateFilterButtonsProps> = ({
  templateFilter,
  setTemplateFilter,
}) => {
  const { t } = useTranslation('activity');

  return (
    <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
      <Button
        type="button"
        variant={templateFilter === 'all' ? 'default' : 'outline'}
        onClick={() => setTemplateFilter('all')}
        className="p-3 shadow-sm"
        title={t('resumeForm.allTemplates')}
      >
        <Grid3X3 className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant={templateFilter === 'cv' ? 'default' : 'outline'}
        onClick={() => setTemplateFilter('cv')}
        className="p-3 shadow-sm"
        title={t('resumeForm.resumeTemplates')}
      >
        <FileText className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant={templateFilter === 'fl' ? 'default' : 'outline'}
        onClick={() => setTemplateFilter('fl')}
        className="p-3 shadow-sm"
        title={t('resumeForm.coverLetterTemplates')}
      >
        <Mail className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TemplateFilterButtons;
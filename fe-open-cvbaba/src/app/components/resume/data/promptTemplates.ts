// src/data/promptTemplates.ts
import { useTranslation } from '@/app/i18n/i18n';

export interface PromptTemplate {
  id: string;
  category: 'resume' | 'cover-letter' | 'job-description' | 'optimization';
  name: string;
  content: string;
}

export const usePromptTemplates = () => {
  const { t } = useTranslation('activity');
  
  const promptTemplates: PromptTemplate[] = [
    {
      id: 'resume-new-grad',
      category: 'resume',
      name: t('templates.resumeNewGrad.name'),
      content: t('templates.resumeNewGrad.content')
    },
    {
      id: 'resume-mid-level',
      category: 'resume',
      name: t('templates.resumeMidLevel.name'),
      content: t('templates.resumeMidLevel.content')
    },
    {
      id: 'resume-senior-level',
      category: 'resume',
      name: t('templates.resumeSeniorLevel.name'),
      content: t('templates.resumeSeniorLevel.content')
    },
    {
      id: 'cover-letter-new-grad',
      category: 'cover-letter',
      name: t('templates.coverLetterNewGrad.name'),
      content: t('templates.coverLetterNewGrad.content')
    },
    {
      id: 'cover-letter-mid-level',
      category: 'cover-letter',
      name: t('templates.coverLetterMidLevel.name'),
      content: t('templates.coverLetterMidLevel.content')
    },
    {
      id: 'cover-letter-senior-level',
      category: 'cover-letter',
      name: t('templates.coverLetterSeniorLevel.name'),
      content: t('templates.coverLetterSeniorLevel.content')
    },
    {
      id: 'optimize-one-page',
      category: 'optimization',
      name: t('templates.optimizeOnePage.name'),
      content: t('templates.optimizeOnePage.content')
    },
    {
      id: 'optimize-impact-experience',
      category: 'optimization',
      name: t('templates.optimizeImpact.name'),
      content: t('templates.optimizeImpact.content')
    }
  ];
  
  return promptTemplates;
};
// components/ModalFooter.tsx
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';
import { Button } from '../ui/Button';

interface ModalFooterProps {
  currentStep: number;
  isNextEnabled: boolean;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  handleSubmit: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  currentStep,
  isNextEnabled,
  goToPrevStep,
  goToNextStep,
  handleSubmit,
}) => {
  const { t } = useTranslation('activity');

  return (
    <div className={`
      border-t border-gray-200 px-3 py-4 sm:px-6 sm:py-4 
      flex items-center bg-white rounded-b-xl
      ${currentStep > 1 ? 'justify-between' : 'justify-end'}
      gap-3 sm:gap-4
      shadow-lg sm:shadow-none
    `}>
      {currentStep > 1 && (
        <Button 
          variant="outline" 
          onClick={goToPrevStep}
          className="hover:bg-gray-100 shadow-sm text-sm sm:text-sm min-w-[80px] sm:min-w-[100px] h-12 sm:h-10"
          size="sm"
        >
          {t('resumeForm.back')}
        </Button>
      )}
      <Button 
        onClick={currentStep === 3 ? handleSubmit : goToNextStep}
        disabled={!isNextEnabled}
        className={`
          shadow-lg transition-all duration-200 text-sm sm:text-sm 
          ${!isNextEnabled 
            ? 'opacity-60 cursor-not-allowed bg-gray-300' 
            : 'hover:shadow-xl hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }
          min-w-[120px] sm:min-w-[120px]
          flex-1 sm:flex-initial
          h-12 sm:h-10
          rounded-xl sm:rounded-lg
          font-semibold
        `}
        size="sm"
      >
        {currentStep === 3 ? (
          <span className="flex items-center justify-center">
            <span className="truncate">{t('resumeForm.createDocument')}</span>
            <Check className="ml-2 h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="truncate">{t('resumeForm.continue')}</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default ModalFooter;
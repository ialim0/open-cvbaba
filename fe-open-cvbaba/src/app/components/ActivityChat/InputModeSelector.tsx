// components/InputModeSelector.tsx
import React from 'react';
import { Type, FileText, Linkedin } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';

interface InputModeSelectorProps {
  inputMode: 'text' | 'file' | 'profile';
  setInputMode: (mode: 'text' | 'file' | 'profile') => void;
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({ inputMode, setInputMode }) => {
  const { t } = useTranslation('activity');

  return (
    <div className="flex justify-center mb-4 sm:mb-6 px-2">
      <div className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm w-full max-w-md" role="group">
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`px-4 py-3 text-sm font-medium rounded-l-lg border-r border-gray-200 flex items-center justify-center flex-1 transition-colors duration-150 ${
            inputMode === 'text'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          aria-label={t('resumeForm.textInput')}
        >
          <Type className={`h-5 w-5 sm:mr-2 ${inputMode === 'text' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">{t('resumeForm.textInput')}</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`px-4 py-3 text-sm font-medium border-r border-gray-200 flex items-center justify-center flex-1 transition-colors duration-150 ${
            inputMode === 'file'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          aria-label={t('resumeForm.fileUpload')}
        >
          <FileText className={`h-5 w-5 sm:mr-2 ${inputMode === 'file' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">{t('resumeForm.fileUpload')}</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('profile')}
          className={`px-4 py-3 text-sm font-medium rounded-r-lg flex items-center justify-center flex-1 transition-colors duration-150 ${
            inputMode === 'profile'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          aria-label={t('resumeForm.analyzeProfile')}
        >
          <Linkedin className={`h-5 w-5 sm:mr-2 ${inputMode === 'profile' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">{t('resumeForm.analyzeProfile')}</span>
        </button>
      </div>
    </div>
  );
};

export default InputModeSelector;
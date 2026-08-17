// components/InputModeSelector.tsx
import React from 'react';
import { Type, FileText, Linkedin } from 'lucide-react';

interface InputModeSelectorProps {
  inputMode: 'text' | 'file' | 'profile';
  setInputMode: (mode: 'text' | 'file' | 'profile') => void;
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({ inputMode, setInputMode }) => {

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
          aria-label="Text input"
        >
          <Type className={`h-5 w-5 sm:mr-2 ${inputMode === 'text' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">Text input</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`px-4 py-3 text-sm font-medium border-r border-gray-200 flex items-center justify-center flex-1 transition-colors duration-150 ${
            inputMode === 'file'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          aria-label="File upload"
        >
          <FileText className={`h-5 w-5 sm:mr-2 ${inputMode === 'file' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">File upload</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('profile')}
          className={`px-4 py-3 text-sm font-medium rounded-r-lg flex items-center justify-center flex-1 transition-colors duration-150 ${
            inputMode === 'profile'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          aria-label="Analyze profile"
        >
          <Linkedin className={`h-5 w-5 sm:mr-2 ${inputMode === 'profile' ? 'text-white' : 'text-gray-600'}`} />
          <span className="hidden sm:inline">Analyze profile</span>
        </button>
      </div>
    </div>
  );
};

export default InputModeSelector;
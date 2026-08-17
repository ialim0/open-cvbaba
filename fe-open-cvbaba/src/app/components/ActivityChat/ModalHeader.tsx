// components/ModalHeader.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  currentStep: number;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, currentStep }) => {
  
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Documentimprovement";
      case 2: return "Choosetemplate";
      case 3: return "Additionalsettings";
      default: return title;
    }
  };

  return (
    <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 bg-white z-10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="hidden sm:block text-base font-semibold text-gray-800 truncate sm:text-lg md:text-xl flex-1 pr-2">
          {getStepTitle()}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-all duration-200 p-3 sm:p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 flex-shrink-0 shadow-sm hover:shadow-md bg-white border border-gray-200 hover:border-gray-300 ml-auto sm:ml-0"
          aria-label={"Closemodal"}
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
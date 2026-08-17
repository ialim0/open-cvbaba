// components/ModalStepper.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface ModalStepperProps {
  currentStep: number;
  steps: number[];
  stepLabels: { [key: number]: string };
}

const ModalStepper: React.FC<ModalStepperProps> = ({ currentStep, steps, stepLabels }) => {
  return (
    <div className="flex px-4 sm:px-6 mt-4 mb-3 gap-2 sm:gap-4">
      {steps.map((step) => (
        <div key={step} className="flex-1 relative">
          {/* Progress bar */}
          <div 
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              step < currentStep
                ? 'bg-blue-600'
                : step === currentStep
                  ? 'bg-blue-400'
                  : 'bg-gray-200'
            }`}
          />
          
          {/* Step label */}
          <div className={`mt-2 text-[10px] xs:text-xs sm:text-sm font-medium text-center transition-colors truncate ${
            step <= currentStep ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {stepLabels[step]}
          </div>
          
          {/* Completed step indicator */}
          {step < currentStep && (
            <div className="absolute -right-1 -top-0.5 sm:-right-2 sm:-top-1">
              <div className="bg-blue-600 rounded-full p-0.5 sm:p-1 flex items-center justify-center">
                <Check className="text-white w-2 h-2 sm:w-2.5 sm:h-2.5" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModalStepper;
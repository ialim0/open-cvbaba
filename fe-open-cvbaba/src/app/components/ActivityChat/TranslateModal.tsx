import React, { useState, useRef, useEffect } from 'react';
import { X, Languages, ChevronDown } from 'lucide-react';
import { ActivityFormData } from '@/app/types/form';
import { languageOptions, getLanguageShortName } from '@/app/config/languages';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TranslateModal: React.FC<TranslateModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(formData.language);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Use shared languageOptions from config

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  const getSelectedLanguageOption = () => {
    const selected = languageOptions.find(option => option.value === selectedLanguage) || languageOptions[0];
    return {
      ...selected,
      label: getLanguageShortName(selected.value)
    };
  };

  const handleLanguageSelect = (languageValue: string) => {
    setSelectedLanguage(languageValue);
    setIsLanguageDropdownOpen(false);
  };

  const handleTranslateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update form data with selected language and translate prompt
    const selectedLanguageOption = languageOptions.find(opt => opt.value === selectedLanguage);
    const translatePrompt = "Translatetolanguageprompt";
    // Persist selected language so Settings/ActivityForm reflect it as current
    try {
      localStorage.setItem('selectedLanguage', selectedLanguage);
    } catch (_) {
      // ignore storage errors (SSR or private mode)
    }

    // Close modal first
    onClose();

    // Update form data with the translate prompt
    setFormData(prev => ({
      ...prev,
      language: selectedLanguage,
      resumeDescription: translatePrompt
    }));

    // Wait a tiny bit for state to update, then submit
    setTimeout(() => {
      // Create a form element to trigger submission
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
      // Immediately clear the textarea content so the translate prompt is not shown
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          resumeDescription: ''
        }));
      }, 0);
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-strong border border-blue-100 dark:border-gray-800 w-full max-w-sm transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-t-xl transition-colors">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">{"Translateto"}</h3>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg p-1.5 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleTranslateSubmit} className="p-4 space-y-4">
          {/* Language Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900 dark:text-blue-400">
              {"Targetlanguage"}
            </label>
            <div className="relative" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg text-left hover:border-blue-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Languages className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{getSelectedLanguageOption().label}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-blue-600 dark:text-blue-500 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg shadow-strong max-h-64 overflow-y-auto transition-colors">
                  <div className="p-2">
                    {languageOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleLanguageSelect(option.value)}
                        className={`w-full px-3 py-3 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors rounded-md ${selectedLanguage === option.value ? 'bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{getLanguageShortName(option.value)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{option.region}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {"Translatedocument"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TranslateModal;

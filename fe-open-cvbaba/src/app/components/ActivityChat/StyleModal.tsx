import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ActivityFormData } from '@/app/types/form';

interface StyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
}

const STANDARD_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Calibri',
  'Garamond',
  'Cambria',
  'Trebuchet MS',
  'Verdana',
  'Tahoma',
  'Palatino Linotype',
  'Book Antiqua',
  'Lucida Sans Unicode',
  'Lucida Grande',
  'Courier New',
  'Franklin Gothic Medium',
  'Segoe UI',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Noto Sans',
  'Inter'
];

const StyleModal: React.FC<StyleModalProps> = ({ isOpen, onClose, formData, setFormData }) => {
  const [selectedFont, setSelectedFont] = useState<string>('Arial');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFont('Arial');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = "Stylewithfontprompt";
    onClose();

    setFormData(prev => ({
      ...prev,
      resumeDescription: prompt,
    }));

    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
      setTimeout(() => {
        setFormData(prev => ({ ...prev, resumeDescription: '' }));
      }, 0);
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-strong border border-blue-100 dark:border-gray-800 w-full max-w-md transform transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-gray-800 rounded-t-xl transition-colors">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">{"Stylemodaltitle"}</h3>
          <button onClick={onClose} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg p-1.5 transition-all duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-400">
            {"Stylefontlabel"}
          </label>

          {/* Dropdown (inspired by Translate modal) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg text-left hover:border-blue-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-all duration-200"
            >
              <span className="text-gray-900 dark:text-gray-100 font-medium" style={{ fontFamily: selectedFont }}>{selectedFont}</span>
              <ChevronDown className={`h-4 w-4 text-blue-600 dark:text-blue-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg shadow-strong max-h-64 overflow-y-auto transition-colors">
                <div className="p-2">
                  {STANDARD_FONTS.map(font => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => { setSelectedFont(font); setIsDropdownOpen(false); }}
                      className={`w-full px-3 py-3 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors rounded-md ${selectedFont === font ? 'bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {"Styleapplybutton"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StyleModal;



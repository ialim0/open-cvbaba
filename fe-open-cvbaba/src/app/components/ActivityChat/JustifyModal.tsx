import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';
import { ActivityFormData } from '@/app/types/form';

interface JustifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
}

const JustifyModal: React.FC<JustifyModalProps> = ({ isOpen, onClose, setFormData }) => {
  const { t } = useTranslation('activity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = t('activityForm.justifyPrompt');

    // Close modal first for snappy UX
    onClose();

    // Update form data with justify prompt
    setFormData(prev => ({
      ...prev,
      resumeDescription: prompt,
    }));

    // Trigger main form submit
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
      // Clear helper text immediately after dispatch
      setTimeout(() => {
        setFormData(prev => ({ ...prev, resumeDescription: '' }));
      }, 0);
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-strong border border-blue-100 dark:border-gray-800 w-full max-w-md transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-gray-800 rounded-t-xl transition-colors">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">{t('activityForm.justifyModalTitle')}</h3>
          <button onClick={onClose} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg p-1.5 transition-all duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('activityForm.justifyPrompt')}
          </p>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('activityForm.justifyApplyButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JustifyModal;

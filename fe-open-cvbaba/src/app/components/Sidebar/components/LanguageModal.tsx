import React from 'react';
import Modal from '../../ui/Modal';
import LanguageSelector from '../../ActivityChat/LanguageSelector';
import { useTranslation } from '@/app/i18n/i18n';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('settings');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('languageSelector.chooseLanguage')}
      ariaLabelledBy="language-modal-title"
      size="lg"
    >
      <div className="p-6 bg-white dark:bg-gray-900">
        <LanguageSelector inline useFlags={false} layout="grid" onLanguageChange={onClose} scope="ui" />
      </div>
    </Modal>
  );
};

export default LanguageModal;

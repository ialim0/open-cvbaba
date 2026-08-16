"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, Loader2, Globe, Mic, User } from 'lucide-react';
import Modal from '../ui/Modal';
import { useTranslation } from '@/app/i18n/i18n';
import { useUserImages } from '@/app/hooks/useUserImages';
import { languageOptions, getLanguageShortName } from '@/app/config/languages';

interface GeneralComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeneralComponent: React.FC<GeneralComponentProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState('');
  const [inputLanguage, setInputLanguage] = useState('en-US');
  const [outputLanguage, setOutputLanguage] = useState('en');

  // Avatar hook
  const { currentAvatar, refreshImages } = useUserImages();

  // Fetch profile on open
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, { withCredentials: true })
        .then((response) => {
          setFullName(response.data.full_name || '');
          setInputLanguage(response.data.input_language || 'en-US');
          setOutputLanguage(response.data.output_language || 'en');
        })
        .catch(() => toast.error(t('settings.loadError')))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, t]);

  // Save all settings
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
        {
          full_name: fullName,
          input_language: inputLanguage,
          output_language: outputLanguage,
        },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          withCredentials: true,
        }
      );
      toast.success(t('settings.saved'));
      onClose();
    } catch {
      toast.error(t('settings.saveError'));
    } finally {
      setIsSaving(false);
    }
  }, [fullName, inputLanguage, outputLanguage, onClose, t]);

  // Photo upload
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
        await refreshImages();
        toast.success(t('settings.photoUploaded'));
      } catch {
        toast.error(t('settings.photoError'));
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const getInitials = (name: string): string =>
    (name || 'U')
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings.title')}
      ariaLabelledBy="settings-modal-title"
      size="lg"
    >
      <div className="p-8 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-700">
              <label
                htmlFor="photo-upload"
                className="relative cursor-pointer group"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-xl">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-blue-600 dark:text-gray-300 text-3xl font-bold">
                      {getInitials(fullName)}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin opacity-0 group-hover:opacity-100" />
                  ) : (
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploadingPhoto}
                />
              </label>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {t('settings.clickToChange')}
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                {t('settings.fullName')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={t('settings.fullNamePlaceholder')}
              />
            </div>

            {/* Voice Input Language */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Mic className="w-4 h-4 mr-2 text-gray-500" />
                {t('settings.voiceLanguage')}
              </label>
              <div className="relative">
                <select
                  value={inputLanguage}
                  onChange={(e) => setInputLanguage(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                  style={{ colorScheme: 'light dark' }}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {getLanguageShortName(lang.value)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Document Output Language */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                {t('settings.documentLanguage')}
              </label>
              <div className="relative">
                <select
                  value={outputLanguage}
                  onChange={(e) => setOutputLanguage(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                  style={{ colorScheme: 'light dark' }}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {getLanguageShortName(lang.value)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-lg font-semibold rounded-xl transition-all focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-xl"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('settings.saving')}
                  </span>
                ) : (
                  t('settings.save')
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GeneralComponent;
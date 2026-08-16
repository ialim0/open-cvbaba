import React, { useState, ChangeEvent, useCallback } from 'react';
import { X, Camera, Loader2, Trash2, Settings, Globe, Mic } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';
import axios from 'axios';
import { ActivityFormData, UserProfile } from '@/app/types/form';
import { useUserImages } from '@/app/hooks/useUserImages';
import { languageOptions, getLanguageShortName } from '@/app/config/languages';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  includePhoto: boolean;
  setIncludePhoto: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  includePhoto,
  setIncludePhoto,
  userProfile,
  setUserProfile,
}) => {
  const { t } = useTranslation('activity');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use the new images hook for avatar
  const { currentAvatar, refreshImages } = useUserImages();

  // Local state for language preferences
  const [inputLanguage, setInputLanguage] = useState(userProfile?.input_language || 'en-US');
  const [outputLanguage, setOutputLanguage] = useState(userProfile?.output_language || 'en');

  // Sync with userProfile when it changes
  React.useEffect(() => {
    if (userProfile?.input_language) {
      setInputLanguage(userProfile.input_language);
    }
    if (userProfile?.output_language) {
      setOutputLanguage(userProfile.output_language);
    }
  }, [userProfile]);

  const handleFileUpload = useCallback(async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);

    const response = await axios.post<{ file_url: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to upload file');
    }
    return response.data.file_url;
  }, []);

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        await handleFileUpload(file);
        // Refresh images list to get the new avatar
        await refreshImages();
      } catch (error) {
        console.error('Error uploading photo:', error);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleSaveLanguages = async () => {
    try {
      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
        {
          input_language: inputLanguage,
          output_language: outputLanguage,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      setUserProfile(response.data);
      // Also update form data with output language
      setFormData(prev => ({ ...prev, language: outputLanguage }));
    } catch (error) {
      console.error('Error saving language preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = async () => {
    // Save language preferences on close
    await handleSaveLanguages();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 id="settings-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('settingsModal.title', { defaultValue: 'Settings' })}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label={t('settingsModal.close', { defaultValue: 'Close settings' })}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Language Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              {t('settingsModal.languagePreferences', { defaultValue: 'Language Preferences' })}
            </h3>

            {/* Voice Input Language */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mic className="h-4 w-4 text-blue-500" />
                {t('settingsModal.voiceInputLanguage', { defaultValue: 'Voice Input Language' })}
              </label>
              <select
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ colorScheme: 'light dark' }}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {getLanguageShortName(lang.value)}
                  </option>
                ))}
              </select>

            </div>

            {/* Document Output Language */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Globe className="h-4 w-4 text-green-500" />
                {t('settingsModal.documentOutputLanguage', { defaultValue: 'Document Output Language' })}
              </label>
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                style={{ colorScheme: 'light dark' }}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {getLanguageShortName(lang.value)}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Photo Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                {t('activityForm.photo')}
              </label>
              {currentAvatar && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('settingsModal.includeInDocuments', { defaultValue: 'Include in documents' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIncludePhoto(!includePhoto)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 ${includePhoto ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    role="switch"
                    aria-checked={includePhoto}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${includePhoto ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Current Photo Display */}
            {currentAvatar && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <img
                  src={currentAvatar}
                  alt={t('activityForm.profile')}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userProfile?.full_name || t('activityForm.profilePhotoAlt', { defaultValue: 'Profile Photo' })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {includePhoto
                      ? t('settingsModal.willAppear', { defaultValue: 'Will appear in documents' })
                      : t('settingsModal.notIncluded', { defaultValue: 'Not included in documents' })}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploadingPhoto}
              />
              <div className="flex flex-col items-center justify-center w-full py-8 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {currentAvatar ? t('activityForm.changePhoto') : t('activityForm.uploadPhoto')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('activityForm.fileFormat')}</p>
                {isUploadingPhoto && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 animate-pulse">
                    {t('activityForm.uploading')}
                  </p>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white dark:text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('activityForm.done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

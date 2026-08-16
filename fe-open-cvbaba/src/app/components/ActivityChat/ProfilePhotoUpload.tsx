// components/ProfilePhotoUpload.tsx
import React from 'react';
import { Loader2, Camera } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';

interface ProfilePhotoUploadProps {
  currentAvatar: string | null;
  isUploadingPhoto: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  includePhoto: boolean;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentAvatar,
  isUploadingPhoto,
  handlePhotoUpload,
  includePhoto,
}) => {
  const { t } = useTranslation('activity');

  if (!includePhoto) return null;

  return (
    <div className="space-y-4 mt-2 sm:mt-3">
      {currentAvatar ? (
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={currentAvatar}
              alt={t('resumeForm.profilePhotoAlt')}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              {isUploadingPhoto ? (
                <Loader2 className="h-3 w-3 text-gray-600 animate-spin" />
              ) : (
                <Camera className="h-3 w-3 text-gray-600" />
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploadingPhoto}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="relative">
            <label
              htmlFor="photo-upload-new"
              className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center">
                {isUploadingPhoto ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                )}
              </div>
              <input
                id="photo-upload-new"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploadingPhoto}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
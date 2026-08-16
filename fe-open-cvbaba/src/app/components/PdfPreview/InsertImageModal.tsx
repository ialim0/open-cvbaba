import React, { useState, useRef, ChangeEvent } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import TextArea from '../ui/Textarea';
import { Image, Loader2, Sparkles, Upload, X } from 'lucide-react';

interface InsertImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (image: File, prompt: string) => void;
    pageNumber: number;
    isUploading: boolean;
}

export const InsertImageModal: React.FC<InsertImageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pageNumber,
    isUploading,
}) => {
    const { t } = useTranslation('activity');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!imageFile) return;
        onConfirm(imageFile, prompt);
        // Reset state
        setImageFile(null);
        setPrompt('');
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const handleClose = () => {
        handleRemoveImage();
        setPrompt('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Image className="h-5 w-5" />
                    <span>{t('pdfPreview.insertImageTitle', { defaultValue: 'Insert Image' })}</span>
                </div>
            }
            size="md"
        >
            <div className="p-6 pt-2 space-y-6">
                {/* Page Info */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('pdfPreview.insertImagePage', { defaultValue: 'Adding image to Page' })} {pageNumber}
                </div>

                {/* Image Upload Area */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('pdfPreview.selectImage', { defaultValue: 'Select Image' })}
                    </label>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                    />

                    {imagePreview ? (
                        <div className="relative border-2 border-purple-200 dark:border-purple-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-contain"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                disabled={isUploading}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                                {imageFile?.name}
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('pdfPreview.clickToUpload', { defaultValue: 'Click to upload image' })}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PNG, JPG, GIF, WebP
                            </span>
                        </button>
                    )}
                </div>

                {/* Instructions Prompt */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                        <span>{t('pdfPreview.imageInstructions', { defaultValue: 'Placement Instructions' })}</span>
                        <span className="text-xs text-gray-400 font-normal">{t('common.optional', { defaultValue: 'Optional' })}</span>
                    </label>
                    <TextArea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('pdfPreview.imagePlaceholder', {
                            defaultValue: 'E.g., "Add as header image", "Place in the skills section", "Use as background"...'
                        })}
                        className="min-h-[80px] resize-none"
                        disabled={isUploading}
                    />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isUploading || !imageFile}
                        className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.uploading', { defaultValue: 'Uploading...' })}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {t('pdfPreview.insertImage', { defaultValue: 'Insert Image' })}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

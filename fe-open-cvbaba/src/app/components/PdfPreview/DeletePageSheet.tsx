import React from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { PageSheet } from './PageSheet';
import { Button } from '../ui/Button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeletePageSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    pageNumber: number;
    isDeleting: boolean;
}

export const DeletePageSheet: React.FC<DeletePageSheetProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pageNumber,
    isDeleting,
}) => {
    const { t } = useTranslation('activity');

    return (
        <PageSheet
            isOpen={isOpen}
            onClose={onClose}
            title={t('pdfPreview.deletePageTitle', { defaultValue: 'Delete Page' })}
            icon={<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
            iconBgColor="bg-red-100 dark:bg-red-900/30"
            disabled={isDeleting}
            footer={
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.deleting', { defaultValue: 'Deleting...' })}
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete', { defaultValue: 'Delete' })}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('pdfPreview.deletePageConfirmTitle', {
                        page: pageNumber,
                        defaultValue: `Delete Page ${pageNumber}?`
                    })}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">
                    {t('pdfPreview.deletePageConfirm', {
                        defaultValue: 'This action cannot be undone. The page will be permanently removed from your document.'
                    })}
                </p>
            </div>
        </PageSheet>
    );
};

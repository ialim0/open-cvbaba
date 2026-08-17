import React from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeletePageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    pageNumber: number;
    isDeleting: boolean;
}

export const DeletePageModal: React.FC<DeletePageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pageNumber,
    isDeleting,
}) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{"Delete Page"}</span>
                </div>
            }
            size="sm"
        >
            <div className="p-6 pt-2">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {`Are you sure you want to delete page ${pageNumber}? This action cannot be undone.`}
                </p>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {"Cancel"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {"Deleting..."}
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {"Delete"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

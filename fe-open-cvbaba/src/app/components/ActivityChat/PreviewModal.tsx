import React from 'react';
import Image from 'next/image';
import Dialog, { DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    imageUrl: string;
  } | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, template }) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{template.name} Template</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Image
            src={template.imageUrl}
            alt={template.name}
            width={375}
            height={500}
            className="rounded-md object-cover"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;

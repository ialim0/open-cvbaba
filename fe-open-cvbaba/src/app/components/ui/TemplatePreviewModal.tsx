
'use client';

import Image from 'next/image';
import { Button } from './button';
import { X } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: {
    name: string;
    image: string;
    description: string;
    characteristics: string[];
  };
  onClose: () => void;
  onSelect: () => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-2xl w-[92vw] max-w-4xl p-6 sm:p-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={template.image}
              alt={template.name}
              width={500}
              height={700}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{template.name}</h2>
            <p className="text-gray-600 mb-6">{template.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Characteristics:</h3>
              <div className="flex flex-wrap gap-2">
                {template.characteristics.map((char) => (
                  <span
                    key={char}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <Button onClick={onSelect} size="lg">
              Select This Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

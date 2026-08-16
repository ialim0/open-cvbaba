'use client';

import Image from 'next/image';
import { Button } from './button';
import { Template } from '@/app/types/template';
import { Eye, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const TemplatePreview = dynamic(() => import('@/app/components/ActivityChat/templates/TemplatePreview'), {
  ssr: false,
});

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
  onPreview: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, onPreview }) => {
  const [cardScale, setCardScale] = useState(0.6);

  useEffect(() => {
    const updateScale = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      setCardScale(isMobile ? 0.52 : 0.6);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      className="group relative cursor-pointer rounded-lg border border-border bg-card-background shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
      onClick={onPreview}
      onKeyPress={(e) => e.key === 'Enter' && onPreview()}
      role="button"
      tabIndex={0}
      aria-label={`Preview ${template.name}`}
    >
      {template.isNew && (
        <div className="absolute top-2 right-2 z-10 rounded-full bg-badge px-3 py-1 text-xs font-semibold text-badge-foreground">
          New
        </div>
      )}
      <div className="overflow-hidden rounded-t-lg">
        <div className="relative w-full" style={{ paddingTop: '141.4%' }}>
          <div className="absolute top-0 left-0 h-full w-full">
            {template.hasComponent ? (
              <TemplatePreview templateId={template.id} scale={cardScale} />
            ) : (
              <Image
                src={template.image}
                alt={template.name}
                layout="fill"
                objectFit="cover"
                className="transform transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
        <p className="mt-1 text-sm text-subtle-foreground">{template.category}</p>
      </div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-lg bg-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          variant="secondary"
          aria-label={`Preview ${template.name}`}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          aria-label={`Select ${template.name}`}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Check className="h-4 w-4" />
          <span>Select</span>
        </Button>
      </div>
    </div>
  );
};

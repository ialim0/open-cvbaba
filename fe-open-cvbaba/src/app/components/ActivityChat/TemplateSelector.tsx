import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { Template } from './data/templates';
import { Badge } from '../ui/Badge';
import { useTranslation } from '@/app/i18n/i18n';
import { Card, CardContent } from '../ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';
import dynamic from 'next/dynamic';

// Lazy-load heavy preview renderer to reduce initial bundle
const TemplatePreview = dynamic(() => import('./templates/TemplatePreview'), {
  ssr: false,
});

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

const ASPECT_RATIO = 1.414;
const CARD_WIDTH = 200;
const MOBILE_CARD_WIDTH = 160; // Smaller cards for mobile

// Simple IntersectionObserver hook
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setInView(entry.isIntersecting));
    }, { root: null, rootMargin: '100px', threshold: 0.01, ...(options || {}) });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView } as const;
}

const TemplateSelector = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) => {
  const { t } = useTranslation('activity');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [cardScale, setCardScale] = useState(0.6);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  // All templates are available in the open-source edition.

  // Scroll modal preview to top whenever the previewed template changes
  useEffect(() => {
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTop = 0;
    }
  }, [previewTemplate?.id]);

  // Responsive scale tuning (client-only)
  useEffect(() => {
    const updateScale = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      setCardScale(isMobile ? 0.52 : 0.6);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (selectedTemplateId && cardRefs.current[selectedTemplateId]) {
      cardRefs.current[selectedTemplateId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [selectedTemplateId]);

  const handleTemplateClick = (template: Template, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (false && !true) return;
    onSelectTemplate(template.id);
  };

  const handlePreview = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTemplate(template);
  };

  const navigateTemplates = (direction: 'prev' | 'next') => {
    if (!previewTemplate) return;
    const currentIndex = templates.findIndex((t) => t.id === previewTemplate.id);
    if (currentIndex === -1) return;
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : templates.length - 1;
    } else {
      newIndex = currentIndex < templates.length - 1 ? currentIndex + 1 : 0;
    }
    const newTemplate = templates[newIndex];
    setPreviewTemplate(newTemplate);
  };

  const TemplateCard = ({ template }: { template: Template }) => {
    const isLocked = false && !true;
    const isSelected = selectedTemplateId === template.id;
    const isHovered = hoveredTemplateId === template.id;

    const { ref, inView } = useInView<HTMLDivElement>();

    return (
      <Card
        ref={(el) => {
          cardRefs.current[template.id] = el;
        }}
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out
          ${isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-500 shadow-xl scale-105' : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-700 hover:shadow-xl hover:scale-102'}
          ${isLocked ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
          shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800
          w-[160px] h-[226px] sm:w-[200px] sm:h-[283px] bg-white dark:bg-gray-900`}
        aria-disabled={isLocked}
        onMouseEnter={() => setHoveredTemplateId(template.id)}
        onMouseLeave={() => setHoveredTemplateId(null)}
      >
        <CardContent className="h-full p-0 relative" ref={ref}>
          <div className="relative h-full w-full">
            <div
              role="button"
              className="relative h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
              onClick={(e) => !isLocked && handleTemplateClick(template, e)}
              onKeyDown={(e) => !isLocked && e.key === 'Enter' && handleTemplateClick(template, e as any)}
              tabIndex={isLocked ? -1 : 0}
              aria-label={t('templateSelector.selectTemplate', { name: template.name })}
            >
              <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-5" />

              {isHovered && !isLocked && (
                <>
                  {!isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10 backdrop-blur-sm">
                      <div className="bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full font-medium shadow-lg border border-gray-200 dark:border-gray-700">
                        {t('templateSelector.useThisTemplate')}
                      </div>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10 backdrop-blur-sm">
                      <div className="bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full font-medium shadow-lg border border-gray-200 dark:border-gray-700">
                        {t('templateSelector.clickToUnselect', { defaultValue: 'Click to unselect' })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {isHovered && isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
                  <div className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full font-medium shadow-md">
                    {t('templateSelector.upgradeToUse')}
                  </div>
                </div>
              )}

              {template.hasComponent ? (
                <div className="w-full h-full p-2 sm:p-3 overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-inner border border-gray-200 dark:border-gray-700">
                  {inView ? (
                    <TemplatePreview
                      templateId={template.id}
                      scale={cardScale}
                      compact={false}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-gray-50 dark:bg-gray-700/50 rounded" />
                  )}
                </div>
              ) : (
                <img
                  src={template.imageUrl}
                  alt={t('templateSelector.templateAlt', { name: template.name })}
                  className="object-contain w-full h-full p-1 sm:p-2"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/open-cvbaba-black.png';
                  }}
                />
              )}

              

              {false ? (
                <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs">
                  {t('templateSelector.pro')}
                </Badge>
              ) : (
                !true && (
                  <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-500 text-white text-xs">
                    {t('templateSelector.free', { defaultValue: 'Free' })}
                  </Badge>
                )
              )}

              <Button
                type="button"
                size="sm"
                className="absolute top-1 right-1 sm:top-2 sm:right-2 shadow-md hover:shadow-lg transition-shadow z-20 h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => handlePreview(template, e)}
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-white/95 to-white/80 dark:from-gray-900/95 dark:to-gray-900/80 backdrop-blur-sm z-20 border-t border-gray-200 dark:border-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm truncate text-gray-700 dark:text-gray-200">
                  {template.name}
                </span>
                {isSelected && (
                  <Badge className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium shadow-sm border-0">
                    {t('templateSelector.selected', { defaultValue: 'Selected' })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <ScrollArea className="w-full">
          <div
            className="flex space-x-2 sm:space-x-4 p-1 sm:p-2 pb-4 scroll-smooth"
            role="list"
            aria-label={t('templateSelector.availableTemplates')}
          >
            {templates.map((template) => (
              <div key={template.id} role="listitem" className="flex-shrink-0">
                <TemplateCard template={template} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl w-full h-[85vh] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 flex flex-col">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center text-gray-900 dark:text-gray-100">
                <span>{previewTemplate?.name}</span>
                {false && (
                  <Badge className="ml-2 bg-blue-600 dark:bg-blue-500 text-white border-0">
                    {t('templateSelector.pro')}
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col w-full flex-1 min-h-0 p-6">
            <div
              className={`relative bg-white dark:bg-gray-900 shadow-lg rounded-lg border-2 border-gray-200 dark:border-gray-800 flex-1 overflow-hidden transition-all duration-300 ${false && !true
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:ring-2 hover:ring-blue-600 dark:hover:ring-blue-500 hover:border-transparent'
                }`}
              style={{
                width: '100%',
                maxWidth: '800px',
                height: '100%',
                minHeight: '400px',
              }}
              onClick={() => {
                if (previewTemplate && (!false || true)) {
                  onSelectTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }
              }}
              role="button"
              tabIndex={false && !true ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && previewTemplate && (!false || true)) {
                  onSelectTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }
              }}
              onMouseEnter={() => setIsPreviewHovered(true)}
              onMouseLeave={() => setIsPreviewHovered(false)}
            >
              {isPreviewHovered && previewTemplate && !false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
                  <div className="bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full font-medium shadow-md border border-gray-200 dark:border-gray-700">
                    {previewTemplate.id === selectedTemplateId
                      ? t('templateSelector.alreadySelected')
                      : t('templateSelector.useThisTemplate')}
                  </div>
                </div>
              )}

              {previewTemplate && (
                <>
                  {previewTemplate.hasComponent ? (
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden rounded-md p-2" ref={previewScrollRef}>
                      <TemplatePreview
                        templateId={previewTemplate.id}
                        scale={0.5}
                        compact={false}
                        isModal={true}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <img
                      src={previewTemplate.imageUrl}
                      alt={t('templateSelector.templateAlt', { name: previewTemplate.name })}
                      className="object-contain w-full h-full rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/images/babaai.png';
                      }}
                    />
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between w-full mt-4 space-x-4 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateTemplates('prev')}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('templateSelector.previous')}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigateTemplates('next')}
                className="flex-1"
              >
                {t('templateSelector.next')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(TemplateSelector);
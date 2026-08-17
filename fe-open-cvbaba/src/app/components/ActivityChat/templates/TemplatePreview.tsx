import React from 'react';
// CV Templates
import JakeTemplate from './CV/JakeTemplate';
import HarvardTemplate1 from './CV/HarvardTemplate1';
import HarvardTemplate2 from './CV/HarvardTemplate2';
import HarvardTemplate3 from './CV/HarvardTemplate3';
import HarvardTemplate4 from './CV/HarvardTemplate4';
import AcademicTemplate1 from './CV/AcademicTemplate1';
import AcademicTemplate2 from './CV/AcademicTemplate2';
import AcademicTemplate3 from './CV/AcademicTemplate3';
import AcademicTemplate4 from './CV/AcademicTemplate4';
import AcademicTemplate5 from './CV/AcademicTemplate5';
// import FAANGTemplate1 from './CV/FAANGTemplate1';
// import FAANGTemplate2 from './CV/FAANGTemplate2';
// import FAANGTemplate3 from './CV/FAANGTemplate3';
// import FAANGTemplate4 from './CV/FAANGTemplate4';
// import FAANGTemplate5 from './CV/FAANGTemplate5';
// import FAANGTemplate6 from './CV/FAANGTemplate6';

interface TemplatePreviewProps {
  templateId: string;
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  templateId, 
  scale = 1, 
  className = '',
  compact = false,
  isModal = false
}) => {
  // Check if we're in a modal context (when scale is 0.5 and not compact, or explicitly set)
  const isModalContext = isModal || (scale === 0.5 && !compact);
  const renderTemplate = () => {
    // Add modal context class for scrolling
    const modalClassName = isModalContext ? 'modal-template' : '';
    const combinedClassName = `${className} ${modalClassName}`.trim();
    
    switch (templateId) {
      case 'jake':
        return <JakeTemplate scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'harvard_01':
        return <HarvardTemplate1 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'harvard_02':
        return <HarvardTemplate2 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'harvard_03':
        return <HarvardTemplate3 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'harvard_04':
        return <HarvardTemplate4 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'academic_01':
        return <AcademicTemplate1 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'academic_02':
        return <AcademicTemplate2 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'academic_03':
        return <AcademicTemplate3 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
      case 'academic_04':
        return <AcademicTemplate4 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
             case 'academic_05':
               return <AcademicTemplate5 scale={scale} className={combinedClassName} compact={compact} isModal={isModalContext} />;
             case 'faang_01':
               return <div>FAANG 1</div>;
             case 'faang_02':
               return <div>FAANG 2</div>;
             case 'faang_03':
               return <div>FAANG 3</div>;
             case 'faang_04':
               return <div>FAANG 4</div>;
             case 'faang_05':
               return <div>FAANG 5</div>;
             case 'cv_sahil':
               return <div>CV Sahil</div>;
             default:
               // For other templates, we'll add them later
               return (
                 <div className={`bg-white text-gray-500 flex items-center justify-center ${className}`}>
                   <div className="text-center">
                     <div className="text-lg font-medium mb-2">Template Preview</div>
                     <div className="text-sm">Coming Soon</div>
                   </div>
                 </div>
               );
    }
  };

  return renderTemplate();
};

export default TemplatePreview;

import React from 'react';

const FAANGTemplate4: React.FC<{
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  return (
    <div className={`bg-white text-gray-500 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Template Preview</div>
        <div className="text-sm">Coming Soon</div>
      </div>
    </div>
  );
};

export default FAANGTemplate4;

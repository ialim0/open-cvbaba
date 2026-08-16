import React from 'react';
import Switch from '../ui/Switch';
import Label from '../ui/Label';

const PhotoToggle: React.FC<{
  includePhoto: boolean;
  setIncludePhoto: (include: boolean) => void;
}> = ({ includePhoto, setIncludePhoto }) => (
  <div className="flex items-center space-x-2">
    <Switch 
      id="include-photo" 
      checked={includePhoto} 
      onCheckedChange={setIncludePhoto} 
    />
    <Label htmlFor="include-photo">Include photo in resume</Label>
  </div>
);

export default React.memo(PhotoToggle);

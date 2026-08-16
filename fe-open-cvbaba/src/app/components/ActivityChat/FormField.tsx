import React from 'react';
import { AutoResizeTextarea } from '../ui/AutoResizeTextarea';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-blue-700 mb-2">
      {label}
    </label>
    <AutoResizeTextarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1"
      minHeight={80}
      maxHeight={200}
      smoothTransition={true}
      variant="default"
    />
  </div>
);

export default React.memo(FormField);

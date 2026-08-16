import React from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value }) => {
  return (
    <option value="" disabled>
      {value || placeholder}
    </option>
  );
};

export { Select, SelectItem, SelectValue };

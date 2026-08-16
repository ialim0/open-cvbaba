import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`border border-blue-200 dark:border-gray-700 rounded-lg p-3 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-blue-400/60 dark:placeholder-gray-500 transition-all duration-200 hover:border-blue-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/20 focus:outline-none resize-y min-h-[100px] ${className}`}
      {...props}
    />
  );
};

export default TextArea;

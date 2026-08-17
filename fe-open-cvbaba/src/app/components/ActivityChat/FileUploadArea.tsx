// components/FileUploadArea.tsx
import React from 'react';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadAreaProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
}) => {

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center mb-6 cursor-pointer transition-all ${
        isDragging
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 bg-gray-50/50'
      }`}
      onClick={() => document.getElementById('file-upload')?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 flex items-center justify-center">
        <Upload className="text-blue-500" size={20} />
      </div>
      <p className="font-medium text-gray-800 text-sm sm:text-base">
        {"Clicktoselectfile"}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        {"Dragdropfile"} (PDF, DOC, DOCX, JPG, PNG)
      </p>
      <input
        id="file-upload"
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mt-3 flex justify-center gap-2">
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="mr-1 h-3 w-3" />
          {"Documents"}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <ImageIcon className="mr-1 h-3 w-3" />
          {"Images"}
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;
'use client';

import React, { useState } from 'react';

interface FileUploadProps {
  label: string;
  multiple?: boolean;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  multiple = false,
  accept = '*/*',
  onFilesSelected,
}) => {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setSelectedNames(filesArr.map((f) => f.name));
      onFilesSelected(filesArr);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-300 mb-2">{label}</label>
      <div className="relative border-2 border-dashed border-gray-700 hover:border-blue-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-gray-900/40">
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="text-2xl">📁</span>
          <span className="text-sm font-medium text-gray-300">
            Click or drag & drop files to upload
          </span>
          <span className="text-xs text-gray-500">Supports PDFs, Images, and ZIP archives</span>
        </div>
      </div>
      {selectedNames.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-blue-400">
          {selectedNames.map((name, i) => (
            <li key={i} className="flex items-center space-x-1">
              <span>✓</span>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

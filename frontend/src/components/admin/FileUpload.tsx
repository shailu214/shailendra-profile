import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileImage, Check } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, dataUrl: string) => void;
  acceptedTypes: string;
  maxSize?: number; // in MB
  preview?: string;
  placeholder?: string;
  className?: string;
  dimensions?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes,
  maxSize = 5,
  preview,
  placeholder = 'Click to upload or drag and drop',
  className = '',
  dimensions = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setIsUploading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onFileSelect(file, dataUrl);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Error reading file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing file');
      setIsUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
      >
        {preview ? (
          // Preview Mode
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-contain rounded-lg border border-gray-200"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">File uploaded successfully</p>
              <p className="text-xs text-gray-500 mt-1">Click to replace or drag a new file</p>
              {dimensions && (
                <p className="text-xs text-gray-400 mt-1">{dimensions}</p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          // Upload Mode
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {acceptedTypes.includes('image') ? (
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                ) : (
                  <FileImage className="w-8 h-8 text-gray-400 mx-auto" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{placeholder}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptedTypes.replace(/[\/\*]/g, '').toUpperCase()} up to {maxSize}MB
                  </p>
                  {dimensions && (
                    <p className="text-xs text-gray-400 mt-1">{dimensions}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {preview && !error && !isUploading && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
          <Check className="w-4 h-4 text-green-600 mr-2" />
          <p className="text-sm text-green-600">File uploaded successfully</p>
        </div>
      )}
    </div>
  );
};
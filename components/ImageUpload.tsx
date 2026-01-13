'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadAction: (file: File) => void;
  currentUrl?: string;
  disabled?: boolean;
}

export default function ImageUpload({ onUploadAction, currentUrl, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUploadAction(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {preview && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

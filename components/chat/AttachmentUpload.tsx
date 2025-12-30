"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface AttachmentUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export default function AttachmentUpload({
  onFilesSelected,
}: AttachmentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      onFilesSelected([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="attachment-upload"
      />
      <label
        htmlFor="attachment-upload"
        className="cursor-pointer flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm">Attach files</span>
      </label>
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded"
            >
              <span className="text-sm text-foreground truncate flex-1">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-background rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


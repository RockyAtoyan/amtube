import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";

import { X } from "lucide-react";

import { Button } from "./button";

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  onClear?: () => void;
  disabled?: boolean;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

const DropZone: FC<DropZoneProps> = ({
  onDrop,
  onClear,
  disabled = false,
  maxFiles = 1,
  accept,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      onDrop(acceptedFiles);
    },
    disabled,
    maxFiles,
    accept,
  });

  const handleClear = () => {
    setFiles([]);
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`dropzone border-2 border-dashed p-4 rounded-md transition-all duration-200 ease-in-out
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            isDragActive
              ? "border-accent bg-accent/10 shadow-md scale-[1.02]"
              : "border-border hover:border-accent/50 hover:bg-accent/5 focus:border-accent focus:ring-2 focus:ring-accent/20"
          }`}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div className="space-y-2">
            <p className="text-primary font-medium">Selected files:</p>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="text-primary/80 text-sm">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        ) : isDragActive ? (
          <p className="text-accent font-medium">Drop the files here ...</p>
        ) : (
          <p className="text-primary/60">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      {!disabled && files.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-1"
        >
          <X size={16} />
          Clear
        </Button>
      )}
    </div>
  );
};

export default DropZone;

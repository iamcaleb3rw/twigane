"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";

// Define the FileWithPreview interface
export interface FileWithPreview {
  id: string; // Unique ID for the file, useful for removal
  file: File; // The actual File object
  previewUrl?: string; // Optional URL for image previews
  // Add any other metadata you need
}

interface UseFileUploadOptions {
  maxSize?: number; // Maximum file size in bytes
  accept?: string; // Accepted file types (e.g., "image/*,application/pdf")
}

export function useFileUpload(options?: UseFileUploadOptions) {
  const [files, setFiles] = useState<FileWithPreview[]>([]); // Now stores FileWithPreview objects
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File) => {
      const newErrors: string[] = [];
      if (options?.maxSize && file.size > options.maxSize) {
        newErrors.push(
          `File "${file.name}" exceeds the maximum size of ${formatBytes(options.maxSize)}.`
        );
      }
      if (
        options?.accept &&
        !file.type.match(new RegExp(options.accept.replace(/\*/g, ".*")))
      ) {
        newErrors.push(`File "${file.name}" has an unsupported type.`);
      }
      return newErrors;
    },
    [options]
  );

  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (selectedFiles && selectedFiles.length > 0) {
        const file = selectedFiles[0]; // Only allow one file for simplicity
        const fileErrors = validateFile(file);
        if (fileErrors.length > 0) {
          setErrors(fileErrors);
          setFiles([]); // Clear files if there are errors
        } else {
          setErrors([]);
          // Create a FileWithPreview object
          const newFileWithPreview: FileWithPreview = {
            id: file.name + file.size + file.lastModified, // Simple unique ID
            file: file,
            previewUrl: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : undefined,
          };
          setFiles([newFileWithPreview]); // Store the FileWithPreview object
        }
      }
    },
    [validateFile]
  );

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // Remove file by its unique ID
  const removeFile = useCallback((fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((fwp) => fwp.id !== fileId));
    setErrors([]); // Clear errors when file is removed
  }, []);

  const getInputProps = useCallback(
    () => ({
      type: "file",
      ref: inputRef,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFileChange(e.target.files),
      style: { display: "none" },
      accept: options?.accept,
    }),
    [handleFileChange, options?.accept]
  );

  return [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] as const;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
}

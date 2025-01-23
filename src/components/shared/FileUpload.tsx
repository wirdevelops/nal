import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: () => void;
  value?: string[];
  accept?: string;
  maxSize?: number;
  previewType?: 'image' | 'document' | 'video';
  className?: string;
  aspectRatio?: 'square' | '16:9' | '4:3';
  showPreview?: boolean;
  multiple?: boolean;
}

export function FileUpload({
  onUpload,
  onRemove,
  value = [],
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  previewType = 'image',
  className,
  aspectRatio = 'square',
  showPreview = true,
  multiple = false
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadProgress = useCallback((index: number, progress: number) => {
    setUploadProgress(prev => {
      const newProgress = [...prev];
      newProgress[index] = progress;
      return newProgress;
    });
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (accept !== '*' && !file.type.startsWith(accept.replace('/*', ''))) {
      return `Invalid file type: ${file.name}. Allowed types: ${accept}`;
    }
    
    if (file.size > maxSize) {
      return `File too large: ${file.name}. Max size: ${maxSize / (1024 * 1024)}MB`;
    }
    
    return null;
  }, [accept, maxSize]);

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setErrors([]);
    
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    
    // Initial validation pass
    files.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
        handleUploadProgress(index, 0);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate file upload progress
      const uploadPromises = validFiles.map(async (file, index) => {
        const totalSteps = 10;
        for (let step = 0; step <= totalSteps; step++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          handleUploadProgress(index, (step / totalSteps) * 100);
        }
        return file;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      await onUpload(uploadedFiles);
      
    } catch (error) {
      setErrors(['Failed to upload files. Please try again.']);
    } finally {
      setIsProcessing(false);
      setUploadProgress([]);
    }
  }, [validateFile, handleUploadProgress, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: accept !== '*' ? { [accept]: [] } : undefined,
    multiple,
    maxSize,
    disabled: isProcessing
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all",
          isDragActive ? "border-primary bg-accent/20" : "border-muted-foreground",
          aspectRatio === 'square' && "aspect-square",
          aspectRatio === '16:9' && "aspect-video",
          aspectRatio === '4:3' && "aspect-4/3",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        {/* Preview Grid */}
        {value.length > 0 && showPreview && (
          <div className="absolute inset-0 p-2 grid grid-cols-2 gap-2 overflow-auto">
            {value.map((url, index) => (
              <div key={url} className="relative">
                {previewType === 'image' && (
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                )}
                {previewType === 'document' && (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {onRemove && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Interface */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-6",
          value.length > 0 && "bg-background/90 hover:bg-background/80 transition-opacity"
        )}>
          {!isProcessing ? (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Drop files here' : 'Drag files or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {accept.split(',').join(', ')} (max {maxSize / (1024 * 1024)}MB each)
                </p>
              </div>
            </>
          ) : (
            <div className="w-full max-w-xs space-y-4">
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-xs text-center text-muted-foreground">
                    Uploading file {index + 1}... {Math.round(progress)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
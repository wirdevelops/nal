import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

export function FileUpload({
  onChange,
  value,
  maxSize = 50 * 1024 * 1024, // 50MB default
  accept = { "image/*": [], "video/*": [], "audio/*": [], "application/pdf": [] }, // Default accepted file types
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const { toast } = useToast();

  // Validate file type and size
  const validateFile = (file: File) => {
    const allowedTypes = Object.keys(accept).flatMap((key) => accept[key]);
    if (!allowedTypes.some((type) => file.type.match(type))) {
      toast({
        title: "Invalid file type",
        description: "The selected file type is not supported.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `The selected file exceeds the maximum size of ${maxSize / 1024 / 1024}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && validateFile(file)) {
        setUploadError(false);
        simulateUpload(file);
      } else {
        setUploadError(true);
      }
    },
    [onChange, accept, maxSize]
  );

  // Simulate upload progress
  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => {
        const newValue = prev + 10;
        if (newValue >= 100) {
          clearInterval(interval);
          onChange(file);
        }
        return newValue;
      });
    }, 200);
  };

  // Retry upload
  const handleRetry = () => {
    if (value) {
      setUploadError(false);
      simulateUpload(value);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg ${
        isDragActive ? "border-primary" : "border-border"
      }`}
    >
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
          <label className="relative cursor-pointer rounded-md bg-background font-semibold text-primary">
            <span>Upload a file</span>
            <input {...getInputProps()} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </p>
        {value && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {value.name}
          </p>
        )}
        {uploadError ? (
          <div className="mt-4">
            <p className="text-sm text-red-500">Upload failed. Please try again.</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : (
          uploadProgress > 0 &&
          uploadProgress < 100 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="mt-2 text-sm text-muted-foreground">
                {uploadProgress}% uploaded
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
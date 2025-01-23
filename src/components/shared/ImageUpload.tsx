import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (images: string[]) => void;
  initialImages?: string[];
  maxFiles?: number;
}

export function ImageUpload({ onUpload, initialImages, maxFiles }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages || []);
  const [loading, setLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setLoading(true)
        try {
            const imageUrls = await Promise.all(acceptedFiles.map(uploadFile));
            setUploadedImages((prevImages) => [...prevImages, ...imageUrls]);
           onUpload([...uploadedImages, ...imageUrls]);
        } catch (e) {
            console.error("Error uploading file:", e)
        }
        finally {
            setLoading(false);
        }
    }, [onUpload, uploadedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    maxSize: maxFiles // 5MB
    });

   const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        onUpload(newImages);
    };


  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn("border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center",
          isDragActive ? "bg-accent" : "border-muted-foreground hover:border-primary"
        )}
      >
          <input {...getInputProps()} />
        <Upload className="h-6 w-6 mb-2" />
          {isDragActive ? <p>Drop the files here...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>

      {/* Display Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-md">
              <img
                  src={image}
                alt={`Uploaded ${index}`}
                  className="object-cover w-full h-32"
              />
              <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white/75 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
}
    
    const uploadFile = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject('Failed to read file');
            }
          };

          reader.onerror = () => {
            reject('Error reading file');
          };

          reader.readAsDataURL(file);
        });
     };
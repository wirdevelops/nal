"use client";
import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ImageUploadDialog = ({ open, onClose, editor }) => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
          const base64Image = event.target.result;

          editor.chain().focus().setImage({ src: base64Image }).run();

            // Clear the file input and file state
            setFile(null);
            if(fileInputRef?.current) fileInputRef.current.value = '';
            onClose()
        };

        reader.readAsDataURL(file);
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                    <DialogDescription>
                        Select an image from your device.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <input
                      ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" // Hide the actual input
                    />
                    <Button onClick={() => fileInputRef?.current?.click()} variant="outline" size="sm">
                      {file ? file.name : 'Select Image'}
                    </Button>
                    <Button disabled={!file} onClick={handleUpload} size="sm">
                        Insert Image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImageUploadDialog
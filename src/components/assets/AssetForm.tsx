import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "./FileUpload";
import { AssetType, AssetCategory } from "@/types/assets";
import { useToast } from "others/use-toast";

interface AssetFormValues {
  name: string;
  type: AssetType;
  category: AssetCategory;
  description?: string;
  file?: File;
}

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AssetFormValues) => Promise<void>;
}

export function AssetForm({ open, onOpenChange, onSubmit }: AssetFormProps) {
  const [values, setValues] = useState<AssetFormValues>({
    name: '',
    type: AssetType.AUDIO,
    category: AssetCategory.PRE_PRODUCTION,
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AssetFormValues, string>>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Validate file type and size
  const validateFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "audio/mpeg", "application/pdf"];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, file: "File type not supported" });
      return false;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, file: "File size exceeds 50MB" });
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (file && validateFile(file)) {
      setValues({ ...values, file });
      setErrors({ ...errors, file: undefined });
    } else {
      setValues({ ...values, file: undefined });
    }
  };

  // Generate file preview
  useEffect(() => {
    if (values.file) {
      const url = URL.createObjectURL(values.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      setPreviewUrl(null);
    }
  }, [values.file]);

  // Validate form
  const validateForm = () => {
    const newErrors: Partial<Record<keyof AssetFormValues, string>> = {};

    if (!values.name) {
      newErrors.name = "Name is required";
    }
    if (!values.type) {
      newErrors.type = "Type is required";
    }
    if (!values.category) {
      newErrors.category = "Category is required";
    }
    if (!values.file) {
      newErrors.file = "File is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onSubmit(values);
        setValues({
          name: '',
          type: AssetType.AUDIO,
          category: AssetCategory.PRE_PRODUCTION,
          description: '',
          file: undefined,
        });
        setPreviewUrl(null);
        onOpenChange(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Error",
          description: "Failed to submit the form. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new asset to the project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset Name</label>
            <Input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Enter asset name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Type</label>
              <Select
                value={values.type}
                onValueChange={(value) => setValues({ ...values, type: value as AssetType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AssetType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={values.category}
                onValueChange={(value) => setValues({ ...values, category: value as AssetCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AssetCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              placeholder="Enter asset description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File</label>
            <FileUpload
              onChange={handleFileUpload}
              value={values.file}
              accept={{ "image/*": [], "video/*": [], "audio/*": [], "application/pdf": [] }}
            />
            {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
          </div>

          {previewUrl && (
            <div className="mt-4">
              {values.file?.type.startsWith("image") ? (
                <img src={previewUrl} alt="Preview" className="w-full rounded-md" />
              ) : values.file?.type.startsWith("video") ? (
                <video src={previewUrl} controls className="w-full rounded-md" />
              ) : values.file?.type.startsWith("audio") ? (
                <audio src={previewUrl} controls className="w-full rounded-md" />
              ) : (
                <p className="text-sm text-muted-foreground">No preview available</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
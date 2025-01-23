import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssetForm } from "./AssetForm";
import { Asset } from "@/types/assets";

interface EditAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAsset: Asset | null;
  onSubmit: (values: any) => Promise<void>;
}

export function EditAssetDialog({ open, onOpenChange, selectedAsset, onSubmit }: EditAssetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Edit the details of the asset</DialogDescription>
        </DialogHeader>
        {selectedAsset && <AssetForm open={open} onOpenChange={onOpenChange} onSubmit={onSubmit} />}
      </DialogContent>
    </Dialog>
  );
}
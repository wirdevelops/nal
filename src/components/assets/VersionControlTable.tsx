import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Asset, AssetVersion } from "@/types/assets";
import { formatDate } from "@/lib/formats";
import { FileUpload } from "./FileUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DiffViewer } from "./DiffViewer";

interface VersionControlTableProps {
  asset: Asset;
  onUploadVersion: (file: File) => Promise<void>;
  onViewVersion: (version: AssetVersion) => void;
  onRestoreVersion: (version: AssetVersion) => void;
  onCompareVersions: (version1: AssetVersion, version2: AssetVersion) => void;
}

export function VersionControlTable({
  asset,
  onUploadVersion,
  onViewVersion,
  onRestoreVersion,
  onCompareVersions,
}: VersionControlTableProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AssetVersion | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [version1, setVersion1] = useState<AssetVersion | null>(null);
  const [version2, setVersion2] = useState<AssetVersion | null>(null);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUploadVersion(file);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  // Handle restore version with confirmation
  const handleRestoreWithConfirmation = (version: AssetVersion) => {
    setSelectedVersion(version);
    setIsConfirmationDialogOpen(true);
  };

  // Confirm restore
  const handleConfirmRestore = async () => {
    if (selectedVersion) {
      await onRestoreVersion(selectedVersion);
      setIsConfirmationDialogOpen(false);
    }
  };

  // Handle compare versions
  const handleCompareVersions = (version1: AssetVersion, version2: AssetVersion) => {
    setVersion1(version1);
    setVersion2(version2);
    setIsDiffViewerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{asset.name}</h3>
          <p className="text-sm text-muted-foreground">
            Current version: v{asset.version} • Last modified: {formatDate(asset.lastModified)}
          </p>
        </div>
        {uploading ? (
          <Button variant="outline" disabled>
            Uploading...
          </Button>
        ) : (
          <Button variant="outline" onClick={handleUpload}>
            Upload New Version
          </Button>
        )}
      </div>
      <FileUpload onChange={setFile} value={file} accept={{ "image/*, video/*, audio/*, application/pdf, text/plain": [] }} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Changes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asset.versions.map((version) => (
            <TableRow key={`${asset.id}-${version.version}`}>
              <TableCell>v{version.version}</TableCell>
              <TableCell>{version.createdBy}</TableCell>
              <TableCell>{formatDate(version.createdAt)}</TableCell>
              <TableCell>{version.changes}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onViewVersion(version)}>
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreWithConfirmation(version)}
                  >
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompareVersions(asset.versions[0], version)}
                  >
                    Compare
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Restore</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore version v{selectedVersion?.version}? This will overwrite the current version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRestore}>Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diff Viewer Dialog */}
      <Dialog open={isDiffViewerOpen} onOpenChange={setIsDiffViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Compare changes between v{version1?.version} and v{version2?.version}
            </DialogDescription>
          </DialogHeader>
          {version1 && version2 && (
            <DiffViewer
              oldVersion={version1.fileUrl}
              newVersion={version2.fileUrl}
              oldVersionLabel={`v${version1.version}`}
              newVersionLabel={`v${version2.version}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
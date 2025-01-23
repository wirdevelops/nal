import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Asset } from "@/types/assets";
import { Eye, Edit, Trash2, Download } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/formats";
import { Checkbox } from "@/components/ui/checkbox";

interface AssetTableProps {
  assets: Asset[];
  isLoading: boolean;
  isAdmin: boolean;
  onView: (asset: Asset) => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onDownload?: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  isLoading,
  isAdmin,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: AssetTableProps) {
  const [sortBy, setSortBy] = useState<keyof Asset>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  // Handle sorting
  const sortedAssets = [...assets].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle bulk selection
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onDelete) {
      selectedAssets.forEach((id) => {
        const asset = assets.find((a) => a.id === id);
        if (asset) onDelete(asset);
      });
      setSelectedAssets([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <p>No assets found</p>
        {isAdmin && (
          <Button variant="link" className="mt-2">
            Add your first asset
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isAdmin && selectedAssets.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedAssets.length})
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && (
              <TableHead>
                <Checkbox
                  checked={selectedAssets.length === assets.length}
                  onCheckedChange={(checked) =>
                    setSelectedAssets(checked ? assets.map((a) => a.id) : [])
                  }
                />
              </TableHead>
            )}
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                if (sortBy === "name") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("name");
                  setSortDirection("asc");
                }
              }}
            >
              Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                if (sortBy === "lastModified") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("lastModified");
                  setSortDirection("asc");
                }
              }}
            >
              Last Modified {sortBy === "lastModified" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              {isAdmin && (
                <TableCell>
                  <Checkbox
                    checked={selectedAssets.includes(asset.id)}
                    onCheckedChange={() => toggleAssetSelection(asset.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>v{asset.version}</TableCell>
              <TableCell>
                <StatusBadge status={asset.status} />
              </TableCell>
              <TableCell>{formatDate(asset.lastModified)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onView(asset)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onDownload && (
                    <Button variant="outline" size="sm" onClick={() => onDownload(asset)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && onDelete && (
                    <Button variant="outline" size="sm" onClick={() => onDelete(asset)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
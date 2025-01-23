import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, Eye, Search } from "lucide-react";
import { Asset, AssetType } from "@/types/assets";
import { formatFileSize } from "@/lib/formats";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface FinalDeliverablesProps {
  assets: Asset[];
  isAdmin: boolean;
  onDownload: (asset: Asset) => Promise<void>;
  onView: (asset: Asset) => void;
  isLoading?: boolean;
}

export function FinalDeliverables({
  assets,
  isAdmin,
  onDownload,
  onView,
  isLoading = false,
}: FinalDeliverablesProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "downloads" | "size">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || asset.type === selectedType;
        const isApproved = asset.status === "approved";
        return matchesSearch && matchesType && isApproved;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortBy === "downloads") {
          return sortDirection === "asc"
            ? a.downloadCount - b.downloadCount
            : b.downloadCount - a.downloadCount;
        }
        // Sort by size
        return sortDirection === "asc"
          ? a.metadata.fileSize - b.metadata.fileSize
          : b.metadata.fileSize - a.metadata.fileSize;
      });
  }, [assets, searchTerm, selectedType, sortBy, sortDirection]);

  // Calculate statistics
  const statistics = useMemo(
    () => ({
      totalAssets: filteredAssets.length,
      totalDownloads: filteredAssets.reduce((sum, a) => sum + a.downloadCount, 0),
      totalSize: filteredAssets.reduce((sum, a) => sum + a.metadata.fileSize, 0),
      formatStats: filteredAssets.reduce((acc, asset) => {
        const format = asset.metadata.format;
        acc[format] = (acc[format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    }),
    [filteredAssets]
  );

  // Handle single download
  const handleDownload = async (asset: Asset) => {
    try {
      setDownloading(asset.id);
      await onDownload(asset);
      toast({
        title: "Download Complete",
        description: `Successfully downloaded ${asset.name}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the asset",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  // Handle bulk download
  const handleBulkDownload = async () => {
    try {
      for (const assetId of selectedAssets) {
        const asset = filteredAssets.find((a) => a.id === assetId);
        if (asset) await onDownload(asset);
      }
      toast({
        title: "Bulk Download Complete",
        description: "All selected assets have been downloaded.",
      });
      setSelectedAssets([]);
    } catch (error) {
      toast({
        title: "Bulk Download Failed",
        description: "There was an error downloading the assets",
        variant: "destructive",
      });
    }
  };

  // Toggle asset selection
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  // Select all assets
  const selectAllAssets = () => {
    setSelectedAssets(
      selectedAssets.length === filteredAssets.length ? [] : filteredAssets.map((a) => a.id)
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Final Deliverables</CardTitle>
            <CardDescription>Access completed project assets and deliverables</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedType}
              onValueChange={(value: AssetType | "all") => setSelectedType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="graphic">Graphic</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="3d-model">3D Model</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalAssets}</div>
                <p className="text-xs text-muted-foreground">
                  {Object.entries(statistics.formatStats)
                    .map(([format, count]) => `${count} ${format}`)
                    .join(", ")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">Across all assets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(statistics.totalSize)}</div>
                <p className="text-xs text-muted-foreground">Total file size</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Download Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(statistics.totalDownloads / (statistics.totalAssets || 1)).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Average downloads per asset</p>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedAssets.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={selectAllAssets}>
                {selectedAssets.length === filteredAssets.length ? "Deselect All" : "Select All"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsConfirmationDialogOpen(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Selected ({selectedAssets.length})
              </Button>
            </div>
          )}

          {/* Assets Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <p>No approved assets found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedAssets.length === filteredAssets.length}
                      onCheckedChange={selectAllAssets}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortBy === "name") {
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy("name");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    Asset Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortBy === "downloads") {
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy("downloads");
                        setSortDirection("desc");
                      }
                    }}
                  >
                    Downloads {sortBy === "downloads" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => toggleAssetSelection(asset.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.metadata.format}</TableCell>
                    <TableCell>{formatFileSize(asset.metadata.fileSize)}</TableCell>
                    <TableCell>{asset.downloadCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {downloading === asset.id ? (
                          <Progress value={45} className="w-[100px]" />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(asset)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(asset)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Download</DialogTitle>
            <DialogDescription>
              Are you sure you want to download {selectedAssets.length} assets?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
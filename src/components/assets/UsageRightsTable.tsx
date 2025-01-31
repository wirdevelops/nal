import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, AssetLicense } from "@/types/assets";
import { useToast } from "others/use-toast";
import { formatDate } from "@/lib/formats";

interface UsageRightsTableProps {
  assets: Asset[];
  onEditRights: (asset: Asset, updates: Partial<Asset>) => Promise<void>;
  onViewHistory: (asset: Asset) => void;
  territories: string[]; // Available territories
}

export function UsageRightsTable({
  assets,
  onEditRights,
  onViewHistory,
  territories,
}: UsageRightsTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    license: AssetLicense;
    expiryDate: Date | null;
    territories: string[];
    isLocked: boolean;
  }>({
    license: AssetLicense.STANDARD,
    expiryDate: null,
    territories: [],
    isLocked: false,
  });
  const [territoryFilter, setTerritoryFilter] = useState("");

  // Filter assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  // Group assets by expiry status
  const groupedAssets = useMemo(() => {
    return filteredAssets.reduce(
      (acc, asset) => {
        if (!asset.expiryDate) {
          acc.noExpiry.push(asset);
        } else if (isBefore(new Date(asset.expiryDate), addDays(new Date(), 30))) {
          acc.expiringSoon.push(asset);
        } else {
          acc.active.push(asset);
        }
        return acc;
      },
      {
        expiringSoon: [] as Asset[],
        active: [] as Asset[],
        noExpiry: [] as Asset[],
      }
    );
  }, [filteredAssets]);

  // Filter territories
  const filteredTerritories = useMemo(() => {
    return territories.filter((territory) =>
      territory.toLowerCase().includes(territoryFilter.toLowerCase())
    );
  }, [territories, territoryFilter]);

  // Handle edit click
  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditForm({
      license: asset.license,
      expiryDate: asset.expiryDate ? new Date(asset.expiryDate) : null,
      territories: asset.territories,
      isLocked: asset.isLocked,
    });
    setIsEditDialogOpen(true);
  };

  // Handle save rights
  const handleSaveRights = async () => {
    if (!selectedAsset) return;

    try {
      await onEditRights(selectedAsset, {
        license: editForm.license,
        expiryDate: editForm.expiryDate?.toISOString(),
        territories: editForm.territories,
        isLocked: editForm.isLocked,
      });
      setIsEditDialogOpen(false);
      toast({
        title: "Rights Updated",
        description: "Asset usage rights have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update asset usage rights",
        variant: "destructive",
      });
    }
  };

  // Handle view history
  const handleViewHistory = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsHistoryDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usage Rights Management</CardTitle>
              <CardDescription>Track and manage asset licenses and usage rights</CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Expiring Soon Section */}
            {groupedAssets.expiringSoon.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-red-500">Expiring Soon</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>License Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Territories</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedAssets.expiringSoon.map((asset) => (
                      <TableRow key={asset.id} className="bg-red-50">
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.license}</TableCell>
                        <TableCell className="text-red-600">
                          {asset.expiryDate ? formatDate(asset.expiryDate) : "N/A"}
                        </TableCell>
                        <TableCell>{asset.territories.join(", ")}</TableCell>
                        <TableCell>
                          <Badge variant={asset.isLocked ? "secondary" : "default"}>
                            {asset.isLocked ? "Locked" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(asset)}
                            >
                              Edit Rights
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewHistory(asset)}
                            >
                              View History
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Active Assets Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Active Assets</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Territories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedAssets.active.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.license}</TableCell>
                      <TableCell>
                        {asset.expiryDate ? formatDate(asset.expiryDate) : "N/A"}
                      </TableCell>
                      <TableCell>{asset.territories.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant={asset.isLocked ? "secondary" : "default"}>
                          {asset.isLocked ? "Locked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(asset)}
                          >
                            Edit Rights
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewHistory(asset)}
                          >
                            View History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* No Expiry Assets Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Perpetual Licenses</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>Territories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedAssets.noExpiry.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.license}</TableCell>
                      <TableCell>{asset.territories.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant={asset.isLocked ? "secondary" : "default"}>
                          {asset.isLocked ? "Locked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(asset)}
                          >
                            Edit Rights
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewHistory(asset)}
                          >
                            View History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Rights Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Usage Rights</DialogTitle>
            <DialogDescription>
              Update the usage rights and restrictions for {selectedAsset?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>License Type</Label>
              <Select
                value={editForm.license}
                onValueChange={(value: AssetLicense) =>
                  setEditForm({ ...editForm, license: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard License</SelectItem>
                  <SelectItem value="extended">Extended License</SelectItem>
                  <SelectItem value="custom">Custom License</SelectItem>
                  <SelectItem value="restricted">Restricted License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Calendar
                mode="single"
                selected={editForm.expiryDate || undefined}
                onSelect={(date) =>
                  setEditForm({ ...editForm, expiryDate: date || null })
                }
                disabled={(date) =>
                  date < new Date() || date > addDays(new Date(), 365 * 2)
                }
                initialFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Territories</Label>
              <Input
                placeholder="Search territories..."
                value={territoryFilter}
                onChange={(e) => setTerritoryFilter(e.target.value)}
                className="mb-2"
              />
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-2">
                  {filteredTerritories.map((territory) => (
                    <div key={territory} className="flex items-center space-x-2">
                      <Checkbox
                        checked={editForm.territories.includes(territory)}
                        onCheckedChange={(checked) => {
                          setEditForm({
                            ...editForm,
                            territories: checked
                              ? [...editForm.territories, territory]
                              : editForm.territories.filter((t) => t !== territory),
                          });
                        }}
                      />
                      <Label>{territory}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={editForm.isLocked}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isLocked: !!checked })
                }
              />
              <Label>Lock Asset</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRights}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Usage Rights History</DialogTitle>
            <DialogDescription>
              View the history of usage rights changes for {selectedAsset?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-2">
                {selectedAsset?.history?.map((entry, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{entry.action}</p>
                    <p className="text-muted-foreground">
                      {format(new Date(entry.timestamp), "PPp")}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset, AssetCategory, AssetType } from "@/types/assets";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import { Filter, Loader } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AssetCategoryTabsProps {
  assets: Asset[];
  isAdmin: boolean;
  onView: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
  isLoading?: boolean; // Added loading state
}

export function AssetCategoryTabs({
  assets,
  isAdmin,
  onView,
  onDownload,
  isLoading = false, // Default to false
}: AssetCategoryTabsProps) {
  const categories: AssetCategory[] = [
    AssetCategory.PRE_PRODUCTION,
    AssetCategory.PRODUCTION,
    AssetCategory.POST_PRODUCTION,
  ];

  // State for filtering
  const [filter, setFilter] = useState<{ type?: AssetType; date?: string }>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Filter assets based on category and filter criteria
  const getFilteredAssets = (category: AssetCategory) => {
    return assets.filter((asset) => {
      const matchesCategory = asset.category === category;
      const matchesType = filter.type ? asset.type === filter.type : true;
      const matchesDate = filter.date ? asset.lastModified.includes(filter.date) : true;
      return matchesCategory && matchesType && matchesDate;
    });
  };

  // Reset filter
  const resetFilter = () => {
    setFilter({});
    setIsFilterDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Categories</CardTitle>
        <CardDescription>Browse assets by production phase</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">
                      {category.charAt(0).toUpperCase() + category.slice(1)} Assets
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getFilteredAssets(category).length} assets in this category
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader className="animate-spin h-8 w-8 text-muted-foreground" />
                  </div>
                ) : (
                  <AssetTable
                    assets={getFilteredAssets(category)}
                    isLoading={false}
                    isAdmin={isAdmin}
                    onView={onView}
                    onDownload={onDownload}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Assets</DialogTitle>
            <DialogDescription>Filter assets by type and date</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Type</label>
              <Select
                value={filter.type || ""}
                onValueChange={(value) => setFilter({ ...filter, type: value as AssetType })}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Last Modified Date</label>
              <Input
                type="date"
                value={filter.date || ""}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilter}>
              Reset
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
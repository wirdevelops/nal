import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Asset, AssetStatus } from "@/types/assets";
import { Eye, Edit, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WorkingFilesTableProps {
  assets: Asset[];
  isAdmin: boolean;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onManageAccess?: (asset: Asset) => void;
  onMarkComplete?: (asset: Asset) => Promise<void>; // New prop for marking as complete
}

export function WorkingFilesTable({
  assets,
  isAdmin,
  onView,
  onEdit,
  onManageAccess,
  onMarkComplete,
}: WorkingFilesTableProps) {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [assignedToFilter, setAssignedToFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "progress">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort assets
  const activeAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
        const matchesAssignedTo = assignedToFilter
          ? asset.assignedTo?.toLowerCase().includes(assignedToFilter.toLowerCase())
          : true;
        return matchesStatus && matchesAssignedTo && asset.status !== "archived";
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          const progressA =
            (a.comments.filter((c) => c.resolvedAt).length / a.comments.length) * 100;
          const progressB =
            (b.comments.filter((c) => c.resolvedAt).length / b.comments.length) * 100;
          return sortDirection === "asc" ? progressA - progressB : progressB - progressA;
        }
      });
  }, [assets, statusFilter, assignedToFilter, sortBy, sortDirection]);

  // Handle mark as complete
  const handleMarkComplete = async (asset: Asset) => {
    if (onMarkComplete) {
      try {
        await onMarkComplete(asset);
        toast({
          title: "Asset Marked as Complete",
          description: `${asset.name} has been marked as complete.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark the asset as complete.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={(value: AssetStatus | "all") => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by assigned user..."
          value={assignedToFilter}
          onChange={(e) => setAssignedToFilter(e.target.value)}
          className="w-[200px]"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
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
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                if (sortBy === "progress") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("progress");
                  setSortDirection("asc");
                }
              }}
            >
              Review Progress {sortBy === "progress" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.assignedTo || "Unassigned"}</TableCell>
              <TableCell>
                <StatusBadge status={asset.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {asset.comments.length > 0 ? (
                    <Progress
                      value={
                        (asset.comments.filter((c) => c.resolvedAt).length / asset.comments.length) *
                        100
                      }
                      className="w-[60px]"
                    />
                  ) : (
                    <Progress value={0} className="w-[60px]" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {asset.comments.filter((c) => c.resolvedAt).length}/{asset.comments.length}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onView(asset)}>
                  View ({asset.comments.length})
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onView(asset)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onManageAccess && (
                        <Button variant="outline" size="sm" onClick={() => onManageAccess(asset)}>
                          Manage Access
                        </Button>
                      )}
                      {asset.comments.filter((c) => c.resolvedAt).length === asset.comments.length && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkComplete(asset)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </>
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
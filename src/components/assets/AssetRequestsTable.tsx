import { useState } from "react";
import { AssetRequest } from "@/types/assets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formats";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AssetRequestsTableProps {
  requests: AssetRequest[];
  isAdmin: boolean;
  onReview: (request: AssetRequest) => void;
  onApprove: (request: AssetRequest) => void;
  onReject: (request: AssetRequest) => void;
  onViewDetails: (request: AssetRequest) => void;
}

export function AssetRequestsTable({
  requests,
  isAdmin,
  onReview,
  onApprove,
  onReject,
  onViewDetails,
}: AssetRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  // Filter requests based on search term
  const filteredRequests = requests.filter((request) =>
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle approve/reject with confirmation
  const handleActionWithConfirmation = (request: AssetRequest, type: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(type);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedRequest && actionType) {
      if (actionType === "approve") {
        onApprove(selectedRequest);
      } else if (actionType === "reject") {
        onReject(selectedRequest);
      }
    }
    setIsConfirmationDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[200px]"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.type}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>{request.requestedBy}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.priority === "high"
                      ? "destructive"
                      : request.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {request.priority}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(request.requestedAt)}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {isAdmin ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReview(request)}
                    >
                      Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionWithConfirmation(request, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionWithConfirmation(request, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                  >
                    View Details
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
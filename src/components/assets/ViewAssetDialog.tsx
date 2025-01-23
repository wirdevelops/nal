import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Asset, AssetComment } from "@/types/assets";
import { Input } from "@/components/ui/input";

interface ViewAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAsset: Asset | null;
  assetComments: AssetComment[];
  onAddComment: (comment: string) => void;
  onResolveComment: (comment: AssetComment) => void;
}

export function ViewAssetDialog({ open, onOpenChange, selectedAsset, assetComments, onAddComment, onResolveComment }: ViewAssetDialogProps) {
  if (!selectedAsset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="space-y-6">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{selectedAsset.name}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                Added on: {format(new Date(selectedAsset.lastModified), "PPp")}
              </div>
            </div>
            <DialogDescription className="text-sm">{selectedAsset.description}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-6">
            <div className="flex-1">
              {selectedAsset.type === "media" && (
                <video src={selectedAsset.url} controls className="w-full aspect-video rounded-md" />
              )}
              {selectedAsset.type === "graphic" && (
                <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full rounded-md" />
              )}
              {selectedAsset.type === "audio" && (
                <audio src={selectedAsset.url} controls className="w-full rounded-md" />
              )}
              {(selectedAsset.type === "document" || selectedAsset.type === "3d-model") && (
                <div className="flex items-center justify-center w-full p-8 text-muted-foreground border-2 border-dashed rounded-md">
                  <p>No Preview available</p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Comments ({assetComments.length})</h3>
                <Button variant="outline" size="sm">
                  All Comments
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {assetComments.map((comment) => (
                    <div key={comment.id} className="rounded-md p-4 shadow-sm bg-muted">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <p>{comment.userName} - {format(new Date(comment.timestamp), "PPp")}</p>
                        {comment.resolvedAt && (
                          <Badge variant="secondary">Resolved {format(new Date(comment.resolvedAt), "PPp")}</Badge>
                        )}
                      </div>
                      <p className="mt-1">{comment.content}</p>
                      {!comment.resolvedAt && (
                        <div className="flex justify-end mt-2">
                          <Button size="sm" onClick={() => onResolveComment(comment)}>
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const comment = formData.get("comment") as string;
                    onAddComment(comment);
                    (e.target as HTMLFormElement).reset();
                  }}
                >
                  <div className="flex gap-2">
                    <Input type="text" name="comment" placeholder="Add a comment..." />
                    <Button type="submit" size="sm">
                      Add comment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
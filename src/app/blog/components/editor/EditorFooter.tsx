import { Button } from "@/components/ui/button";

export function EditorFooter() {
  return (
    <div className="flex justify-end gap-2 p-4 border-t bg-card">
      <Button variant="outline">Save Draft</Button>
      <Button>Publish</Button>
    </div>
  );
}
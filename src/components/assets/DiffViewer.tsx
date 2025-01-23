import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface DiffViewerProps {
  oldVersion: string; // URL or content of the old version
  newVersion: string; // URL or content of the new version
  oldVersionLabel: string; // Label for the old version (e.g., "v1")
  newVersionLabel: string; // Label for the new version (e.g., "v2")
}

export function DiffViewer({ oldVersion, newVersion, oldVersionLabel, newVersionLabel }: DiffViewerProps) {
  const [oldContent, setOldContent] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch file content
  useEffect(() => {
    const fetchContent = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch file");
        return await response.text();
      } catch (err) {
        setError("Failed to load file content");
        return null;
      }
    };

    const loadFiles = async () => {
      setIsLoading(true);
      const oldText = await fetchContent(oldVersion);
      const newText = await fetchContent(newVersion);
      setOldContent(oldText);
      setNewContent(newText);
      setIsLoading(false);
    };

    loadFiles();
  }, [oldVersion, newVersion]);

  // Highlight differences between two strings
  const highlightDifferences = (oldText: string, newText: string) => {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");

    return newLines.map((line, index) => {
      const oldLine = oldLines[index] || "";
      if (line === oldLine) {
        return <div key={index} className="text-muted-foreground">{line}</div>;
      } else {
        return (
          <div key={index} className="bg-yellow-100 p-1">
            <span className="text-red-500 line-through">{oldLine}</span>{" "}
            <span className="text-green-500">{line}</span>
          </div>
        );
      }
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!oldContent || !newContent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Preview Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The selected file type does not support text comparison.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">{oldVersionLabel}</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              {oldContent}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{newVersionLabel}</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              {newContent}
            </pre>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Differences</h3>
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
            {highlightDifferences(oldContent, newContent)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
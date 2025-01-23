'use client';
import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  File,
  FileText,
  Film,
  Image as ImageIcon,
  MoreVertical,
  Music,
  Upload,
  Folder,
  Plus,
  ArrowLeft,
  Download,
  Trash,
  Move,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { useFileManagement } from '@/hooks/useFileManagement';
import { FileCategory } from '@/stores/useFileStore';

const getFileIcon = (category: FileCategory) => {
  switch (category) {
    case 'video':
      return Film;
    case 'image':
      return ImageIcon;
    case 'audio':
      return Music;
    case 'script':
      return FileText;
    default:
      return File;
  }
};

export default function FilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folderName, setFolderName] = useState('');

  const {
    files,
    folders,
    uploadProgress,
    isUploading,
    uploadFiles,
    createFolder,
    deleteFile,
    deleteFolder,
    moveFile,
    moveFolder,
    getFolderPath,
    searchFiles,
  } = useFileManagement(projectId);

  const currentFolderPath = currentFolderId ? getFolderPath(currentFolderId) : [];
  const filteredFiles = searchQuery ? searchFiles(searchQuery) : files;
  const currentFiles = filteredFiles.filter(f => f.folderId === currentFolderId);
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      await uploadFiles(Array.from(files), currentFolderId);
      setUploadDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
    }
  };

  const handleCreateFolder = () => {
    if (!folderName) return;

    try {
      createFolder(folderName, currentFolderId);
      setCreateFolderOpen(false);
      setFolderName('');
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, isFolder: boolean) => {
    try {
      if (isFolder) {
        deleteFolder(id);
      } else {
        deleteFile(id);
      }
      toast({
        title: 'Success',
        description: `${isFolder ? 'Folder' : 'File'} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground">
            Manage your project files and documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Folder className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Folder Path / Breadcrumb */}
      {currentFolderPath.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentFolderId(undefined)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Root
          </Button>
          {currentFolderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <span>/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentFolderId(folder.id)}
                className={index === currentFolderPath.length - 1 ? 'font-medium text-foreground' : ''}
              >
                {folder.name}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Folders */}
            {currentFolders.map((folder) => (
              <TableRow key={folder.id}>
                <TableCell className="font-medium">
                  <Button
                    variant="ghost"
                    className="h-8 p-2"
                    onClick={() => setCurrentFolderId(folder.id)}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.name}
                  </Button>
                </TableCell>
                <TableCell>Folder</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{format(new Date(folder.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(folder.id, true)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {/* Files */}
            {currentFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {React.createElement(getFileIcon(file.category), { className: "w-4 h-4" })}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell>{file.category}</TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>{file.uploadedBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(file.path, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Move className="w-4 h-4 mr-2" />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(file.id, false)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Choose files to upload to your project
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to select files
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Files
              </Button>
            </div>

            {/* Upload Progress */}
            {isUploading && Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input 
                id="folderName" 
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name" 
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCreateFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFolder}
                disabled={!folderName}
              >
                Create Folder
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
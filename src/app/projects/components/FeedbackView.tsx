import React, { useState, useRef, useEffect } from 'react';
import { useProjectMedia } from 'others/useProjectMedia';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from '@/components/ui/button';
import {
    Pencil,
    MouseIcon,
    MessageSquare,
    Save,
    Undo,
    X,
    Check,
    Plus,
    History,
    Minus,
} from 'lucide-react';
import {
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistance } from 'date-fns';
import { ProjectMedia } from '@/stores/useProjectMediaStore';

interface FeedbackViewProps {
    projectId: string;
    className?: string;
}

type Tool = 'select' | 'draw' | 'comment';

export function FeedbackView({ projectId, className }: FeedbackViewProps) {
    const {
        getFeedbackMedia,
        uploadFeedback,
        addAnnotation,
        updateAnnotation,
        removeAnnotation,
        updateMedia
    } = useProjectMedia(projectId);

    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>('select');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(1);

    const feedbackMedia = getFeedbackMedia();
    const currentMedia = feedbackMedia.find(m => m.id === selectedMedia);


    useEffect(() => {
        if (currentMedia && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Reset canvas and load image
            const img = new Image();
            img.src = currentMedia.url;
            img.onload = () => {
                // Set canvas size to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Draw existing annotations
                if (currentMedia.metadata?.annotations) {
                    currentMedia.metadata.annotations.forEach(annotation => {
                        if (annotation.type === 'drawing' && annotation.path) {
                            drawPath(ctx, annotation.path, annotation.color || '#ff0000');
                        } else if (annotation.type === 'marker') {
                            drawMarker(ctx, annotation.position.x, annotation.position.y);
                        }
                    });
                }
            };
        }
    }, [currentMedia]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool !== 'draw') return;

        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPath(`M ${offsetX} ${offsetY}`);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || selectedTool !== 'draw') return;

        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPath(prev => `${prev} L ${offsetX} ${offsetY}`);

        // Draw current path
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.stroke(new Path2D(currentPath));
        }
    };

    const handleMouseUp = () => {
        if (selectedTool !== 'draw') return;

        setIsDrawing(false);
        if (currentPath && selectedMedia) {
            addAnnotation(selectedMedia, {
                type: 'drawing',
                path: currentPath,
                color: '#ff0000',
                content: '',
                position: { x: 0, y: 0 },
                author: 'Current User',
            });
        }
        setCurrentPath('');
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool === 'comment' && selectedMedia) {
            const { offsetX, offsetY } = e.nativeEvent;
            addAnnotation(selectedMedia, {
                type: 'comment',
                content: 'Add your comment here...',
                position: { x: offsetX, y: offsetY },
                author: 'Current User',
            });
        }
    };

    const drawPath = (ctx: CanvasRenderingContext2D, path: string, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke(new Path2D(path));
    };

    const drawMarker = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.beginPath();
        ctx.fillStyle = '#ff0000';
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    };

    const handleFileUpload = async (file: File) => {
        const media = await uploadFeedback(file);
        setSelectedMedia(media.id);
    };

    // Helper function to format time
    const formatDistanceToNow = (date: Date) => {
        return formatDistance(date, new Date(), { addSuffix: true });
    };

      // Helper function to create a new version
    const createVersion = async (mediaId: string) => {
        if (!currentMedia) return;
      
        const currentVersion = currentMedia.metadata?.version || 0;
        const newVersion = currentVersion + 1;
      
        const updatedMedia: ProjectMedia = {
          ...currentMedia,
          metadata: {
            ...currentMedia.metadata,
            version: newVersion,
            versions: {
              ...currentMedia.metadata?.versions,
                [newVersion]: {
                  annotations: currentMedia.metadata?.annotations || [],
                  timestamp: new Date().toISOString()
                },
            },
          },
        };
      
        await updateMedia(mediaId, updatedMedia);
    };
    
      // Helper function to revert to a specific version
      const revertToVersion = async (mediaId: string, version: number) => {
          if (!currentMedia || !currentMedia.metadata?.versions || !currentMedia.metadata.versions[version]) return;

          const selectedVersion = currentMedia.metadata.versions[version];
          const updatedMedia: ProjectMedia = {
            ...currentMedia,
            metadata: {
              ...currentMedia.metadata,
              annotations: selectedVersion.annotations,
            }
        };
        await updateMedia(mediaId, updatedMedia);

    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Upload Area */}
            {feedbackMedia.length === 0 && (
                <FileUpload
                    onFileSelect={handleFileUpload}
                    accept="image/*"
                    aspectRatio="16:9"
                    maxSize={5 * 1024 * 1024}
                />
            )}

            {/* Media Selection */}
            {feedbackMedia.length > 0 && (
                <div className="flex gap-2 overflow-x-auto p-2">
                    {feedbackMedia.map(media => (
                        <button
                            key={media.id}
                            onClick={() => setSelectedMedia(media.id)}
                            className={cn(
                                "relative rounded-lg overflow-hidden",
                                "w-24 h-24 border-2",
                                selectedMedia === media.id ? "border-primary" : "border-transparent"
                            )}
                        >
                            <img
                                src={media.url}
                                alt={media.filename}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                    <FileUpload
                        onFileSelect={handleFileUpload}
                        accept="image/*"
                        className="w-24 h-24"
                        aspectRatio="square"
                    />
                </div>
            )}

            {/* Tools */}
            {selectedMedia && (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={selectedTool === 'select' ? 'default' : 'outline'}
                        onClick={() => setSelectedTool('select')}
                    >
                        <MouseIcon className="w-4 h-4 mr-2" />
                        Select
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedTool === 'draw' ? 'default' : 'outline'}
                        onClick={() => setSelectedTool('draw')}
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        Draw
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedTool === 'comment' ? 'default' : 'outline'}
                        onClick={() => setSelectedTool('comment')}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Comment
                    </Button>
                </div>
            )}

            {/* Canvas */}
            {selectedMedia && currentMedia && (
                <div className="relative border rounded-lg overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={handleClick}
                    />

                    {/* Annotations */}
                    {currentMedia.metadata?.annotations?.map(annotation => (
                        annotation.type === 'comment' && (
                            <div
                                key={annotation.id}
                                className="absolute bg-background border rounded-lg p-2 shadow-lg"
                                style={{
                                    left: `${annotation.position.x}px`,
                                    top: `${annotation.position.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    <textarea
                                        className="min-w-[200px] p-2 text-sm resize-none"
                                        defaultValue={annotation.content}
                                        onChange={(e) => {
                                            updateAnnotation(selectedMedia, annotation.id, {
                                                content: e.target.value
                                            });
                                        }}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => annotation.id && removeAnnotation(selectedMedia, annotation.id)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        {!annotation.resolved && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    updateAnnotation(selectedMedia, annotation.id, {
                                                        resolved: true
                                                    });
                                                }}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {annotation.author} • {formatDistanceToNow(new Date(annotation.timestamp))} ago
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Zoom and Controls */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScale(prev => Math.max(0.25, prev - 0.25))}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScale(prev => Math.min(3, prev + 0.25))}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {Math.round(scale * 100)}%
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            // Create a new version
                            if (selectedMedia) {
                                createVersion(selectedMedia);
                            }
                        }}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Version
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                                <History className="w-4 h-4 mr-2" />
                                Versions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {currentMedia?.metadata?.versions && Object.entries(currentMedia.metadata.versions).map(([key, version]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => {
                                        if (selectedMedia) {
                                          revertToVersion(selectedMedia, parseInt(key));
                                        }
                                    }}
                                >
                                    Version {key}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
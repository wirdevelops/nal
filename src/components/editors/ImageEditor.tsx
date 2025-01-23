import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Crop,
  Move,
  ZoomIn,
  SunMedium,
  Contrast,
  ImageDown,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Undo,
  Redo,
} from 'lucide-react';
import {Label} from "@/components/ui/label";
import ReactCrop, { type Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: Blob, modifications: ImageModifications) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export interface ImageModifications {
  crop?: CropType;
  rotation?: number;
  flip?: { horizontal: boolean; vertical: boolean };
  adjustments?: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

export function ImageEditor({
  imageUrl,
  onSave,
  onCancel,
  aspectRatio,
}: ImageEditorProps) {
  const [crop, setCrop] = useState<CropType>();
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [selectedTool, setSelectedTool] = useState<'crop' | 'adjust'>('crop');
  const [modifications, setModifications] = useState<ImageModifications[]>([]);
  const [currentModIndex, setCurrentModIndex] = useState(-1);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addModification = (mod: Partial<ImageModifications>) => {
    const newMods = [...modifications.slice(0, currentModIndex + 1), {
      crop,
      rotation,
      flip,
      adjustments,
      ...mod,
    }];
    setModifications(newMods);
    setCurrentModIndex(newMods.length - 1);
  };

  const undo = () => {
    if (currentModIndex > 0) {
      const prevMod = modifications[currentModIndex - 1];
      setCrop(prevMod.crop);
      setRotation(prevMod.rotation || 0);
      setFlip(prevMod.flip || { horizontal: false, vertical: false });
      setAdjustments(prevMod.adjustments || {
        brightness: 100,
        contrast: 100,
        saturation: 100,
      });
      setCurrentModIndex(currentModIndex - 1);
    }
  };

  const redo = () => {
    if (currentModIndex < modifications.length - 1) {
      const nextMod = modifications[currentModIndex + 1];
      setCrop(nextMod.crop);
      setRotation(nextMod.rotation || 0);
      setFlip(nextMod.flip || { horizontal: false, vertical: false });
      setAdjustments(nextMod.adjustments || {
        brightness: 100,
        contrast: 100,
        saturation: 100,
      });
      setCurrentModIndex(currentModIndex + 1);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on crop or original image
    const width = crop ? crop.width : image.naturalWidth;
    const height = crop ? crop.height : image.naturalHeight;
    canvas.width = width;
    canvas.height = height;

    // Apply transformations
    ctx.save();
    
    // Apply rotation
    if (rotation) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
    }

    // Apply flip
    if (flip.horizontal || flip.vertical) {
      ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    }

    // Draw the image with crop
    if (crop) {
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        width,
        height
      );
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }

    // Apply adjustments
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      const brightnessMultiplier = adjustments.brightness / 100;
      data[i] *= brightnessMultiplier; // Red
      data[i + 1] *= brightnessMultiplier; // Green
      data[i + 2] *= brightnessMultiplier; // Blue

      // Apply contrast
      const contrast = (adjustments.contrast - 100) / 100;
      data[i] = ((data[i] / 255 - 0.5) * (1 + contrast) + 0.5) * 255;
      data[i + 1] = ((data[i + 1] / 255 - 0.5) * (1 + contrast) + 0.5) * 255;
      data[i + 2] = ((data[i + 2] / 255 - 0.5) * (1 + contrast) + 0.5) * 255;

      // Apply saturation
      const saturation = adjustments.saturation / 100;
      const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
      data[i] = gray + (data[i] - gray) * saturation;
      data[i + 1] = gray + (data[i + 1] - gray) * saturation;
      data[i + 2] = gray + (data[i + 2] - gray) * saturation;
    }

    ctx.putImageData(imageData, 0, 0);
    ctx.restore();

    // Convert to blob and save
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob, {
          crop,
          rotation,
          flip,
          adjustments,
        });
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="relative border rounded-lg overflow-hidden bg-muted">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          aspect={aspectRatio}
          disabled={selectedTool !== 'crop'}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Edit preview"
            style={{
              transform: `rotate(${rotation}deg) scale(${flip.horizontal ? -1 : 1}, ${
                flip.vertical ? -1 : 1
              })`,
              filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
            }}
          />
        </ReactCrop>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Tools */}
      <Tabs value={selectedTool} onValueChange={(value) => setSelectedTool(value as 'crop' | 'adjust')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crop">
            <Crop className="w-4 h-4 mr-2" />
            Crop & Transform
          </TabsTrigger>
          <TabsTrigger value="adjust">
            <SunMedium className="w-4 h-4 mr-2" />
            Adjustments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crop" className="space-y-4">
          {/* Rotation Controls */}
          <div className="space-y-2">
            <Label>Rotation</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRotation((prev) => (prev - 90) % 360);
                  addModification({ rotation: (rotation - 90) % 360 });
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Slider
                min={-180}
                max={180}
                step={1}
                value={[rotation]}
                onValueChange={([value]) => {
                  setRotation(value);
                  addModification({ rotation: value });
                }}
              />
            </div>
          </div>

          {/* Flip Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFlip((prev) => ({
                  ...prev,
                  horizontal: !prev.horizontal,
                }));
                addModification({
                  flip: { ...flip, horizontal: !flip.horizontal },
                });
              }}
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFlip((prev) => ({
                  ...prev,
                  vertical: !prev.vertical,
                }));
                addModification({
                  flip: { ...flip, vertical: !flip.vertical },
                });
              }}
            >
              <FlipVertical className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4">
          {/* Brightness */}
          <div className="space-y-2">
            <Label>Brightness</Label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[adjustments.brightness]}
              onValueChange={([value]) => {
                setAdjustments((prev) => ({
                  ...prev,
                  brightness: value,
                }));
                addModification({
                  adjustments: { ...adjustments, brightness: value },
                });
              }}
            />
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <Label>Contrast</Label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[adjustments.contrast]}
              onValueChange={([value]) => {
                setAdjustments((prev) => ({
                  ...prev,
                  contrast: value,
                }));
                addModification({
                  adjustments: { ...adjustments, contrast: value },
                });
              }}
            />
          </div>

          {/* Saturation */}
          <div className="space-y-2">
            <Label>Saturation</Label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[adjustments.saturation]}
              onValueChange={([value]) => {
                setAdjustments((prev) => ({
                  ...prev,
                  saturation: value,
                }));
                addModification({
                  adjustments: { ...adjustments, saturation: value },
                });
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* History Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentModIndex <= 0}
          onClick={undo}
        >
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentModIndex >= modifications.length - 1}
          onClick={redo}
        >
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <ImageDown className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
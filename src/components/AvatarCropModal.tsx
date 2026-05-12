import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarCropModalProps {
  imageUrl: string;
  onSave: (croppedImageUrl: string) => void;
  onClose: () => void;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function AvatarCropModal({ imageUrl, onSave, onClose }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageUrl;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to the cropped area size
      canvas.width = Math.max(1, Math.round(croppedAreaPixels.width));
      canvas.height = Math.max(1, Math.round(croppedAreaPixels.height));

      // Draw the cropped image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        onSave(url);
        toast.success('Avatar updated successfully! ✨');
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-family-heading)] text-2xl">
              Crop Your Avatar
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Adjust the position and zoom to frame your photo
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative h-96 bg-muted">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Zoom Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Zoom</label>
              <span className="text-sm text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ZoomOut className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <ZoomIn className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createCroppedImage}
              className="flex-1 py-3 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Avatar</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Palette } from 'lucide-react';
import { toast } from 'sonner';

export type UploadChild = {
  id: string;
  name: string;
  age: number;
};

interface UploadAreaProps {
  children: UploadChild[];
  onUpload: (file: File, child: UploadChild) => void;
  onCreateChild?: () => void;
  onClose: () => void;
}

export function UploadArea({ children, onUpload, onClose, onCreateChild }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState('');

  // If children are provided, default to the first child
  // when the component mounts or when the children list changes.
  // This ensures the select shows a default value but still allows
  // the user to change it.
  useEffect(() => {
    if (children && children.length > 0) {
      setSelectedChildId((prev) => (prev ? prev : children[0].id));
    }
  }, [children]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedChildId) {
      toast.error('Selectionne une image et un enfant');
      return;
    }

    const selectedChild = children.find((child) => child.id === selectedChildId);
    if (!selectedChild) {
      toast.error('Enfant introuvable');
      return;
    }

    onUpload(selectedFile, selectedChild);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[var(--font-family-heading)] text-3xl">
            Upload Masterpiece 🎨
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-4 border-dashed rounded-3xl p-12 mb-6 transition-all cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-2xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Change image
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-[var(--font-family-heading)] text-xl mb-2">
                  Drop your little one's art here 🎨
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse files
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-2 text-sm">Enfant</label>
            <select
              value={selectedChildId}
              onChange={(e) => {
                const val = e.target.value;
                // special value to create a new child
                if (val === '__create__') {
                  // call parent handler if provided
                  // parent is expected to open the My Children page/modal
                  onCreateChild?.();
                  // reset selection until parent updates children
                  setSelectedChildId('');
                  return;
                }
                setSelectedChildId(val);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Choisir un enfant</option>
              <option value="__create__">+ Créer un enfant...</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.age} ans)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || !selectedChildId || children.length === 0}
          className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          Upload Masterpiece ✨
        </button>
        {children.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            Ajoute d'abord un enfant dans "My Children" pour publier un dessin.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

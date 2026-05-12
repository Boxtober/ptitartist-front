import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Palette } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { toast } from 'sonner';

export type UploadChild = {
  id: string;
  name: string;
  age: number;
};

interface UploadAreaProps {
  children: UploadChild[];
  onUpload: (file: File, child: UploadChild, imageDescription?: string, createdAt?: string) => void;
  onCreateChild?: () => void;
  onClose: () => void;
}

export function UploadArea({ children, onUpload, onClose, onCreateChild }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [createdDate, setCreatedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

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

    // convert createdDate (YYYY-MM-DD) to ISO at UTC midnight
    const createdAtIso = createdDate ? new Date(`${createdDate}T00:00:00Z`).toISOString() : undefined;
    onUpload(selectedFile, selectedChild, imageDescription?.trim() || undefined, createdAtIso);
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
          <div>
            <label className="block mb-2 text-sm">Date de création (optionnel)</label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{createdDate || 'Sélectionner une date'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={createdDate ? new Date(createdDate) : undefined}
                    onSelect={(date: Date | undefined) => {
                      if (!date) {
                        setCreatedDate('');
                        return;
                      }
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                      const dd = String(date.getDate()).padStart(2, '0');
                      setCreatedDate(`${yyyy}-${mm}-${dd}`);
                    }}
                    
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Si laissé vide, la date du jour sera utilisée.</p>
          </div>
          <div>
            <label className="block mb-2 text-sm">Description de l'image (optionnel)</label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Par ex. 'Dessin du chien au parc'"
              className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none transition-colors h-24"
            />
            <p className="text-xs text-muted-foreground mt-2">Cette description sera enregistrée avec l'image et peut aider à la recherche.</p>
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

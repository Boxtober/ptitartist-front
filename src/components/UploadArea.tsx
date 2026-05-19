import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Palette } from 'lucide-react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  const [createdDate, setCreatedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (children && children.length > 0) {
      const firstValid = children.find((c) => c.age <= 24) || children[0];
      setSelectedChildId((prev) => (prev ? prev : firstValid ? firstValid.id : ''));
    }
  }, [children]);

  const formatDateYMD = (d: Date) => d.toISOString().slice(0, 10);

  const getMaxAllowedDateForChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return '';
    const today = new Date();
    const birth = new Date(today);
    birth.setFullYear(birth.getFullYear() - child.age);
    const max = new Date(birth);
    max.setFullYear(max.getFullYear() + 24);
    return formatDateYMD(max);
  };

  // drag/drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileSelection(files[0]);
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
    if (files && files[0]) handleFileSelection(files[0]);
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

    if (selectedChild.age > 24) {
      toast.error("L'enfant sélectionné a plus de 24 ans et ne peut pas être choisi.");
      return;
    }

    // convert createdDate (YYYY-MM-DD) to ISO at UTC midnight
    const createdAtIso = createdDate ? new Date(`${createdDate}T00:00:00Z`).toISOString() : undefined;
    onUpload(selectedFile, selectedChild, imageDescription?.trim() || undefined, createdAtIso);
    onClose();
  };

  // compute maxDate for the date picker based on selected child
  const computedMaxDay = selectedChildId ? dayjs(getMaxAllowedDateForChild(selectedChildId)) : dayjs();

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
          <h2 className="font-[var(--font-family-heading)] text-3xl">Upload Masterpiece 🎨</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
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
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />

          {previewUrl ? (
            <div className="space-y-4">
              <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-2xl" />
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
                <p className="font-[var(--font-family-heading)] text-xl mb-2">Drop your little one's art here 🎨</p>
                <p className="text-muted-foreground text-sm">or click to browse files</p>
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
                if (val === '__create__') {
                  onCreateChild?.();
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
                <option key={child.id} value={child.id} disabled={child.age > 24}>
                  {child.name} ({child.age} ans){child.age > 24 ? ' — >24 ans' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Date de création (optionnel)</label>
            <div className="flex items-center gap-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(createdDate)}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const val = (newValue as any).format('YYYY-MM-DD');
                    if (selectedChildId) {
                      const max = getMaxAllowedDateForChild(selectedChildId);
                      if (max && val > max) {
                        toast.error("Date is not valid. Please choose an earlier date.");
                        return;
                      }
                    }
                    setCreatedDate(val);
                  }}
                  // apply classes to the native input via slotProps — return only desired props to avoid forwarding internal MUI props
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      inputProps: {
                        className:
                          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                      },
                    },
                  } as any}
                  maxDate={computedMaxDay && computedMaxDay.isValid() ? computedMaxDay : dayjs()}
                />
              </LocalizationProvider>
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

 
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || !selectedChildId || children.length === 0}
          className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          Upload Masterpiece ✨
        </button>
        {children.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">Ajoute d'abord un enfant dans "My Children" pour publier un dessin.</p>
        )}
      </motion.div>
    </motion.div>
  );
}

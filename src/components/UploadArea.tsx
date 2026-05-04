import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface UploadAreaProps {
  onUpload: (file: File, childName: string, age: number) => void;
  onClose: () => void;
}

export function UploadArea({ onUpload, onClose }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
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
    if (!selectedFile || !childName || !age) {
      toast.error('Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast.error('Please enter a valid age (1-18)');
      return;
    }

    onUpload(selectedFile, childName, ageNum);
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
            <label className="block mb-2 text-sm">Child's Name</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Emma"
              className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="5"
              min="1"
              max="18"
              className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || !childName || !age}
          className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          Upload Masterpiece ✨
        </button>
      </motion.div>
    </motion.div>
  );
}

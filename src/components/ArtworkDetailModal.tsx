import { motion } from 'motion/react';
import { X, Download, Heart, Calendar as CalendarIcon, User } from 'lucide-react';
import type { Drawing } from './types';
import { useState } from 'react';
import { DeleteImageButton } from './DeleteImageButton';
import { toast } from 'sonner';
import { addFavorite, removeFavorite } from '../api/auth';
import { updateImage } from '../api/auth';
import { useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';

interface ArtworkDetailModalProps {
  drawing: Drawing;
  onClose: () => void;
  onDeleted?: (imageId: string) => void;
  onFavoriteToggled?: (imageId: string, isFav: boolean) => void;
}

export function ArtworkDetailModal({ drawing, onClose, onDeleted, onFavoriteToggled }: ArtworkDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(Boolean(drawing.isFavorite));
  const [editingDate, setEditingDate] = useState<string>(() => {
    try {
      // convert ISO to local datetime-local value
      const dt = new Date(drawing.createdAt || new Date().toISOString());
      const offset = dt.getTimezoneOffset();
      const local = new Date(dt.getTime() - offset * 60000);
      return local.toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  });
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    setEditingDate(() => {
      try {
        const dt = new Date(drawing.createdAt || new Date().toISOString());
        const offset = dt.getTimezoneOffset();
        const local = new Date(dt.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
      } catch {
        return new Date().toISOString().slice(0, 16);
      }
    });
  }, [drawing.createdAt]);

  const handleDownload = () => {
    // Create a download link
    const link = document.createElement('a');
    link.href = drawing.imageUrl;
    link.download = `${drawing.childName}-${drawing.age}-${drawing.date.replace(/,/g, '')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper: detect whether a description string is the internal metadata JSON
  const isInternalMeta = (text?: string | null) => {
    if (!text) return false;
    try {
      const p = JSON.parse(text);
      if (p && typeof p === 'object' && ('childName' in p || 'age' in p)) return true;
      return false;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="flex-1 bg-muted p-8 flex items-center justify-center">
          <img
            src={drawing.imageUrl}
            alt={`Drawing by ${drawing.childName}`}
            className="max-w-full max-h-[70vh] object-contain rounded-2xl"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-96 p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-[var(--font-family-heading)] text-3xl mb-2">
                Masterpiece ✨
              </h2>
              <p className="text-sm text-muted-foreground">
                Created with love and imagination
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Artist Info */}
          <div className="space-y-4 mb-6 flex-1">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Artist</p>
                  <p className="font-[var(--font-family-heading)] text-xl">
                    {drawing.childName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-white">
                  {drawing.age} years old
                </span>
              </div>
            </div>

            {(drawing.imageDescription || (drawing.description && !isInternalMeta(drawing.description))) && (
              <div className="p-4 rounded-2xl bg-white/80 border border-border">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1 text-sm">{drawing.imageDescription ?? drawing.description}</p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-muted/50 flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created on</p>
                {/* Display a single human-friendly date: either the editingDate (if present) or the image createdAt or today */}
                {(() => {
                  // editingDate is local datetime-local (YYYY-MM-DDTHH:MM)
                  const dateToShow = editingDate ? new Date(editingDate) : new Date(drawing.createdAt || new Date().toISOString());
                  const formatted = dateToShow.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
                  return (
                    <div className="flex items-center gap-3">
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <button className="font-medium text-left underline-offset-2 hover:underline">
                            {formatted}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <Calendar
                            mode="single"
                            selected={editingDate ? new Date(editingDate.slice(0, 10)) : (drawing.createdAt ? new Date(drawing.createdAt) : new Date())}
                            onSelect={async (date: Date | undefined) => {
                              if (!date) return;
                              const yyyy = date.getFullYear();
                              const mm = String(date.getMonth() + 1).padStart(2, '0');
                              const dd = String(date.getDate()).padStart(2, '0');
                              // build a local datetime at midnight (no time UI)
                              const newLocal = `${yyyy}-${mm}-${dd}T00:00`;
                              setEditingDate(newLocal);
                              try {
                                // interpret local as local timezone and convert to ISO UTC
                                const local = new Date(newLocal);
                                const iso = new Date(local.getTime() - (local.getTimezoneOffset() * 60000)).toISOString();
                                await updateImage(drawing.id, { createdAt: iso });
                                toast.success('Date mise à jour');
                                window.dispatchEvent(new CustomEvent('images:updated'));
                              } catch (err: any) {
                                toast.error(err?.message ?? 'Erreur lors de la mise à jour');
                              }
                              // close popover after selection
                              setPopoverOpen(false);
                            }}
                            
                          />
                        </PopoverContent>
                      </Popover>

                      {/* No time input: date-only. */}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={async () => {
                const prev = isFavorite;
                setIsFavorite(!prev);
                try {
                  if (!prev) {
                    toast('Ajout aux favoris...');
                    await addFavorite(drawing.id);
                    toast.success('Ajouté aux favoris');
                  } else {
                    toast('Suppression des favoris...');
                    await removeFavorite(drawing.id);
                    toast.success('Retiré des favoris');
                  }
                  // notify parent about the change
                  onFavoriteToggled?.(drawing.id, !prev);
                } catch (err: any) {
                  setIsFavorite(prev); // revert
                  toast.error(err?.message ?? "Erreur lors de l'opération");
                }
              }}
              className={`w-full py-3 rounded-full border-2 transition-all flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-primary border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-full bg-secondary hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Artwork</span>
            </button>

            <DeleteImageButton
              imageId={drawing.id}
              onDeleted={() => {
                // close modal after deletion and notify parent to remove the image from state
                onClose();
                onDeleted?.(drawing.id);
              }}
            />
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-3 rounded-xl bg-accent/20 text-xs text-center text-muted-foreground">
            🔒 This artwork is private and only visible to you
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { motion } from "motion/react";
import {
  X,
  Download,
  Heart,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import type { Drawing } from "./types";
import { useState } from "react";
import { DeleteImageButton } from "./DeleteImageButton";
import { toast } from "sonner";
import { addFavorite, removeFavorite } from "../api/auth";
import { updateImage } from "../api/auth";
import { useEffect } from "react";
// Popover/calendar replaced by MUI DatePicker in this file
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface ArtworkDetailModalProps {
  drawing: Drawing;
  onClose: () => void;
  onDeleted?: (imageId: string) => void;
  onFavoriteToggled?: (imageId: string, isFav: boolean) => void;
}

export function ArtworkDetailModal({
  drawing,
  onClose,
  onDeleted,
  onFavoriteToggled,
}: ArtworkDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(
    Boolean(drawing.isFavorite),
  );
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
  // popover state removed; using inline MUI DatePicker

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
    const link = document.createElement("a");
    link.href = drawing.imageUrl;
    link.download = `${drawing.childName}-${drawing.age}-${drawing.date.replace(/,/g, "")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isInternalMeta = (text?: string | null) => {
    if (!text) return false;
    try {
      const p = JSON.parse(text);
      if (p && typeof p === "object" && ("childName" in p || "age" in p))
        return true;
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

            {(drawing.imageDescription ||
              (drawing.description &&
                !isInternalMeta(drawing.description))) && (
              <div className="p-4 rounded-2xl bg-white/80 border border-border">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1 text-sm">
                  {drawing.imageDescription ?? drawing.description}
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-muted/50 flex items-center gap-3 w-full">
              <div className="w-full">
                <p className="text-xs text-muted-foreground pb-2">Created on</p>
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          editingDate
                            ? dayjs(editingDate.slice(0, 10))
                            : dayjs(drawing.createdAt ?? undefined)
                        }
                        onChange={async (newValue) => {
                          if (!newValue) return;
                          const val = (newValue as any).format("YYYY-MM-DD");

                          const newLocal = `${val}T00:00`;

                          try {
                            const local = new Date(newLocal);
                            const iso = new Date(
                              local.getTime() -
                                local.getTimezoneOffset() * 60000,
                            ).toISOString();
                            await updateImage(drawing.id, { createdAt: iso });
                            setEditingDate(newLocal);
                            toast.success("Date updated");
                            window.dispatchEvent(
                              new CustomEvent("images:updated"),
                            );
                          } catch (err: any) {
                            toast.error(
                              err?.message ??
                                "Error occurred while updating the date",
                            );
                          }
                        }}
                        slotProps={{
                          yearButton: {
                            sx: {
                              fontFamily: "Nunito, sans-serif !important",
                              fontSize: "12px !important",
                              "&.Mui-selected": {
                                backgroundColor: "#FFB7C5 !important",
                                color: "#3D3250 !important",
                                fontFamily: "Nunito, sans-serif !important",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "#C9B8F0 !important",
                              },
                              "&.Mui-selected:focus": {
                                backgroundColor: "#FFB7C5 !important",
                              },
                            },
                          },
                          textField: {
                            sx: {
                              "& .MuiPickersOutlinedInput-sectionsContainer": {
                                fontFamily: "Nunito, sans-serif !important",
                              },

                              "& .MuiPickersSectionList-section": {
                                fontFamily: "Nunito, sans-serif !important",
                              },

                              "& .MuiPickersSectionList-sectionContent": {
                                fontFamily: "Nunito, sans-serif !important",
                              },
                            },
                          },
                          day: {
                            sx: {
                              fontFamily: "Nunito, sans-serif !important",
                              "&.Mui-selected": {
                                backgroundColor: "#FFB7C5 !important",
                                color: "#3D3250 !important",
                                fontFamily: "Nunito, sans-serif !important",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "#C9B8F0 !important",
                              },
                              "&.Mui-selected:focus": {
                                backgroundColor: "#FFB7C5 !important",
                              },

                              "&.MuiPickersDay-today:not(.Mui-selected)": {
                                border: "1.5px solid #FFB7C5 !important",
                                color: "#3D3250 !important",
                              },
                            },
                          },
                        }}
                        maxDate={dayjs()}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
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
                    toast("Adding to favorites...");
                    await addFavorite(drawing.id);
                    toast.success("Added to favorites");
                  } else {
                    toast("Removing from favorites...");
                    await removeFavorite(drawing.id);
                    toast.success("Removed from favorites");
                  }
                  // notify parent about the change
                  onFavoriteToggled?.(drawing.id, !prev);
                } catch (err: any) {
                  setIsFavorite(prev); // revert
                  toast.error(
                    err?.message ?? "Error occurred while toggling favorite",
                  );
                }
              }}
              className={`w-full py-3 rounded-full border-2 transition-all flex items-center justify-center gap-2 ${
                isFavorite
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
              <span>{isFavorite ? "Favorited" : "Add to Favorites"}</span>
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

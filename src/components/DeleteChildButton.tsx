import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteChildButton({
  childId,
  childName,
  onDelete,
}: {
  childId: string;
  childName: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    console.log("DeleteChildButton: starting delete for", childId);
    try {
      await onDelete(childId);
    } catch (err: any) {
      console.error("Delete child failed", err);
      toast.error(err?.message ?? "Error occurred while deleting the child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center cursor-pointer pointer-events-auto z-50"
          title={`Delete ${childName}`}
          aria-label={`Delete ${childName}`}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {childName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The artworks related to this child will remain visible in your
            gallery. This action will permanently delete the child's profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Deletion..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export function DeleteChildButton({ childId, childName, onDelete }: { childId: string; childName: string; onDelete: (id: string) => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    console.log('DeleteChildButton: starting delete for', childId);
    toast('Suppression en cours...');
    try {
      await onDelete(childId);
      toast.success('Enfant supprimé');
    } catch (err: any) {
      console.error('Delete child failed', err);
      toast.error(err?.message ?? 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          // stop propagation on multiple event types so the parent Link doesn't navigate
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center cursor-pointer pointer-events-auto z-50"
          title={`Supprimer ${childName}`}
          aria-label={`Supprimer ${childName}`}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr·e de vouloir supprimer {childName} ?</AlertDialogTitle>
          <AlertDialogDescription>
            Les dessins relatifs à cet enfant resteront visibles dans votre galerie. Cette action supprimera définitivement le profil de l'enfant.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

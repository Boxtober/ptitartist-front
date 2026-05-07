import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { deleteImage } from '../api/auth';
import { toast } from 'sonner';

export function DeleteImageButton({ imageId, onDeleted }: { imageId: string; onDeleted?: (deleted: any) => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteImage(imageId);
      toast.success('Image supprimée');
      onDeleted?.(res.deleted ?? null);
    } catch (err: any) {
      console.error('Failed to delete image', err);
      toast.error(err?.message ?? 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Supprimer</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette image</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible — l'image sera supprimée définitivement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Suppression...' : 'Confirmer la suppression'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

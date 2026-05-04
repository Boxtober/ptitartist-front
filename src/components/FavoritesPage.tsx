import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GalleryCard } from './GalleryCard';
import type { Drawing } from './GalleryCard';
import { useState } from 'react';
import { ArtworkDetailModal } from './ArtworkDetailModal';

export function FavoritesPage() {
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  // Mock favorite drawings
  const favoriteDrawings: Drawing[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1761403942462-04b8b97f1fe9?w=400',
      childName: 'Sophie',
      age: 6,
      date: 'April 15, 2026',
      rotation: -2,
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1761403935539-0c971c206f25?w=400',
      childName: 'Emma',
      age: 7,
      date: 'April 20, 2026',
      rotation: -1,
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1697962176820-b52c00e311f1?w=400',
      childName: 'Liam',
      age: 6,
      date: 'April 27, 2026',
      rotation: 1,
    },
  ];

  if (favoriteDrawings.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="relative w-48 h-48 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--bubblegum-pink)] via-[var(--lavender)] to-[var(--mint-green)] opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-24 h-24 text-[var(--bubblegum-pink)]" />
              </div>
            </div>

            <h3 className="font-[var(--font-family-heading)] text-3xl sm:text-4xl">
              No favorites yet!
            </h3>
            <p className="text-muted-foreground text-lg">
              Start adding artwork to your favorites to see them here ❤️
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--bubblegum-pink)] to-[var(--lavender)] flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <div>
              <h1 className="font-[var(--font-family-heading)] text-5xl">
                Favorite Masterpieces
              </h1>
              <p className="text-muted-foreground text-lg">
                Your most loved artwork collection ❤️
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20"
          >
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm">
              {favoriteDrawings.length} masterpiece{favoriteDrawings.length !== 1 ? 's' : ''}{' '}
              saved to favorites
            </p>
          </motion.div>
        </div>

        {/* Gallery */}
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          const card = target.closest('[data-drawing-id]');
          if (card) {
            const drawingId = card.getAttribute('data-drawing-id');
            const drawing = favoriteDrawings.find(d => d.id === drawingId);
            if (drawing) setSelectedDrawing(drawing);
          }
        }}>
          <ResponsiveMasonry
  columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}
>
          <Masonry
            columnsCount={3}
            gutter="24px"
           
          >
            {favoriteDrawings.map((drawing) => (
              <GalleryCard key={drawing.id} drawing={drawing} />
            ))}
          </Masonry></ResponsiveMasonry>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDrawing && (
        <ArtworkDetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
        />
      )}
    </div>
  );
}

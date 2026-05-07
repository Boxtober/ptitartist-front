import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart } from 'lucide-react';
import type { Drawing } from './types';

export function GalleryCard({ drawing }: { drawing: Drawing }) {
  return (
    <motion.div
      data-drawing-id={drawing.id}
      className="group relative bg-white rounded-3xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
      style={{
        transform: `rotate(${drawing.rotation}deg)`,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        transition: { duration: 0.3 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Drawing image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
        <ImageWithFallback
          src={drawing.imageUrl}
          alt={`Drawing by ${drawing.childName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Museum label */}
      <div className="space-y-1 text-sm">
        <p className="font-[var(--font-family-heading)] text-base">
          {drawing.childName}, {drawing.age}
        </p>
        <p className="text-muted-foreground text-xs">{drawing.date}</p>
      </div>

      {/* Favorite badge */}
      <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center">
        <div className="pointer-events-none flex items-center justify-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${drawing.isFavorite ? 'bg-[var(--bubblegum-pink)]' : 'bg-white/80 group-hover:bg-white'}`}>
            <Heart className={`w-4 h-4 ${drawing.isFavorite ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

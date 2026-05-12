import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart } from 'lucide-react';
import type { Drawing } from './types';

export function SmallGalleryCard({ drawing }: { drawing: Drawing }) {
  return (
    <motion.div
      data-drawing-id={drawing.id}
      className="group relative bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{
        transform: `rotate(${drawing.rotation}deg)`,
      }}
      whileHover={{
        scale: 1.03,
        rotate: 0,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
        <ImageWithFallback
          src={drawing.imageUrl}
          alt={`Drawing by ${drawing.childName}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-1 text-xs">
        <p className="font-[var(--font-family-heading)] text-sm">
          {drawing.childName}, {drawing.age}
        </p>
        <p className="text-muted-foreground text-xs">{drawing.date}</p>
      </div>

      <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${drawing.isFavorite ? 'bg-[var(--bubblegum-pink)]' : 'bg-white/80 group-hover:bg-white'}`}>
          <Heart className={`w-3 h-3 ${drawing.isFavorite ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
      </div>
    </motion.div>
  );
}

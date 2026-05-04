import { HeroSection } from './HeroSection';
import { Gallery } from './Gallery';
import { FloatingActionButton } from './FloatingActionButton';
import { UploadArea } from './UploadArea';
import { ArtworkDetailModal } from './ArtworkDetailModal';
import type { Drawing } from './types';
import { useState } from 'react';

interface HomePageProps {
  drawings: Drawing[];
  onUpload: (file: File, childName: string, age: number) => void;
}

export function HomePage({ drawings, onUpload }: HomePageProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  return (
    <>
      <HeroSection onUploadClick={() => setShowUpload(true)} />
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const card = target.closest('[data-drawing-id]');
          if (card) {
            const drawingId = card.getAttribute('data-drawing-id');
            const drawing = drawings.find((d) => d.id === drawingId);
            if (drawing) setSelectedDrawing(drawing);
          }
        }}
      >
        <Gallery drawings={drawings} />
      </div>
      <FloatingActionButton onClick={() => setShowUpload(true)} />

      {showUpload && (
        <UploadArea onUpload={onUpload} onClose={() => setShowUpload(false)} />
      )}

      {selectedDrawing && (
        <ArtworkDetailModal drawing={selectedDrawing} onClose={() => setSelectedDrawing(null)} />
      )}
    </>
  );
}

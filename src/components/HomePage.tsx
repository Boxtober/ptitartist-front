import { HeroSection } from './HeroSection';
import { Gallery } from './Gallery';
import { FloatingActionButton } from './FloatingActionButton';
import { UploadArea, type UploadChild } from './UploadArea';
import { ArtworkDetailModal } from './ArtworkDetailModal';
import type { Drawing } from './types';
import { useState } from 'react';

interface HomePageProps {
  drawings: Drawing[];
  children: UploadChild[];
  onUpload: (file: File, child: UploadChild) => void;
  onImageDeleted?: (imageId: string) => void;
  onToggleFavorite?: (imageId: string, isFav: boolean) => void;
  canUpload?: boolean;
  onGuestActionClick?: () => void;
}

export function HomePage({
  drawings,
  children,
  onUpload,
  onImageDeleted,
  onToggleFavorite,
  canUpload = true,
  onGuestActionClick,
}: HomePageProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  return (
    <>
      <HeroSection
        onPrimaryActionClick={() => {
          if (canUpload) {
            setShowUpload(true);
            return;
          }
          onGuestActionClick?.();
        }}
        primaryActionLabel={canUpload ? 'Upload a drawing' : 'Se connecter pour publier'}
      />
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
      {canUpload && <FloatingActionButton onClick={() => setShowUpload(true)} />}

      {canUpload && showUpload && (
        <UploadArea
          children={children}
          onUpload={onUpload}
          onClose={() => setShowUpload(false)}
          onCreateChild={() => {
            setShowUpload(false);
            // navigate to My Children page — simple approach using location
            window.location.href = '/my-children';
          }}
        />
      )}

      {selectedDrawing && (
        <ArtworkDetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
          onDeleted={(id) => {
            setSelectedDrawing(null);
            onImageDeleted?.(id);
          }}
          onFavoriteToggled={(id, fav) => {
            onToggleFavorite?.(id, fav);
          }}
        />
      )}
    </>
  );
}

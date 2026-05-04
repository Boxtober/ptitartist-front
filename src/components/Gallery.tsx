import { GalleryCard } from './GalleryCard';
import type { Drawing } from './types';
import { EmptyState } from './EmptyState';

export function Gallery({ drawings }: { drawings: Drawing[] }) {
  if (drawings.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="font-[var(--font-family-heading)] text-4xl sm:text-5xl text-center mb-12">
        Our Little Artists 🎨
      </h2>

      <div className="masonry-grid" style={{ columnGap: 24, columnCount: 3 }}>
        {drawings.map((drawing) => (
          <div key={drawing.id} style={{ breakInside: 'avoid', marginBottom: 24 }}>
            <GalleryCard drawing={drawing} />
          </div>
        ))}
      </div>
    </section>
  );
}


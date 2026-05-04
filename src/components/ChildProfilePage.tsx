import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Cake, TrendingUp, Download } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GalleryCard } from './GalleryCard';
import type { Drawing } from './GalleryCard';
import { useState } from 'react';
import { ArtworkDetailModal } from './ArtworkDetailModal';

export function ChildProfilePage() {
  const { childId } = useParams();
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  // Mock data - in real app, fetch based on childId
  const childData = {
    name: 'Sophie',
    age: 6,
    birthdate: 'March 15, 2020',
    totalArtworks: 12,
    avatarColor: 'var(--bubblegum-pink)',
  };

  const childDrawings: Drawing[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1761403942462-04b8b97f1fe9?w=400',
      childName: 'Sophie',
      age: 6,
      date: 'April 15, 2026',
      rotation: -2,
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1761403948893-c6438c52925a?w=400',
      childName: 'Sophie',
      age: 6,
      date: 'April 10, 2026',
      rotation: 1.5,
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1761403935539-0c971c206f25?w=400',
      childName: 'Sophie',
      age: 6,
      date: 'April 5, 2026',
      rotation: -1,
    },
  ];

  const stats = [
    { label: 'Total Artworks', value: childData.totalArtworks, icon: TrendingUp },
    { label: 'This Month', value: 5, icon: Calendar },
    { label: 'Age', value: `${childData.age} years`, icon: Cake },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/children"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Children</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor: childData.avatarColor }}
            >
              {childData.name.charAt(0)}
            </div>

            <div className="flex-1">
              <h1 className="font-[var(--font-family-heading)] text-5xl mb-2">
                {childData.name}'s Gallery 🎨
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                Celebrating creativity and imagination
              </p>
              <p className="text-sm text-muted-foreground">
                Born {childData.birthdate}
              </p>
            </div>

            <button className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-[var(--font-family-heading)] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {['All Time', 'This Month', 'Last 3 Months', '2026', '2025'].map((filter) => (
            <button
              key={filter}
              className="px-6 py-2 rounded-full bg-white hover:bg-primary hover:text-white transition-all whitespace-nowrap border border-border hover:border-primary"
            >
              {filter}
            </button>
          ))}
        </div>

 <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}>


        <Masonry
          columnsCount={3}
          gutter="24px"
         
        >
          {childDrawings.map((drawing) => (
            <div key={drawing.id} onClick={() => setSelectedDrawing(drawing)}>
              <GalleryCard drawing={drawing} />
            </div>
          ))}
        </Masonry> 
        </ResponsiveMasonry>
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

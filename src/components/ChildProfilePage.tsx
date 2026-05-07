import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Cake, TrendingUp, Download } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GalleryCard } from './GalleryCard';
import type { Drawing } from './types';
import { useState, useEffect } from 'react';
import { ArtworkDetailModal } from './ArtworkDetailModal';
import { getChildren, getImages, type ApiImage } from '../api/auth';
import { toast } from 'sonner';

export function ChildProfilePage() {
  const { childId } = useParams();
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [childData, setChildData] = useState<{ id: string; name: string; birthdate?: string | null; avatarColor?: string } | null>(null);
  const [childDrawings, setChildDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);

  function calculateAgeFromBirthdate(birthDate?: string | null) {
    if (!birthDate) return 0;
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return Math.max(age, 0);
  }

  function mapApiImageToDrawing(image: ApiImage): Drawing {
    // try to parse metadata if any
    let childName = image.child?.firstName ?? 'Unknown';
    let age = 0;
    try {
      if (image.description) {
        const parsed = JSON.parse(image.description) as { childName?: string; age?: number };
        childName = parsed.childName ?? childName;
        age = Number(parsed.age ?? 0);
      }
    } catch {
      // ignore
    }
    return {
      id: image.id,
      imageUrl: image.url,
      childName,
      age,
      date: new Date(image.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rotation: (Math.random() * 6) - 3,
      isFavorite: Boolean((image as any).isFavorite),
    };
  }

  useEffect(() => {
    if (!childId) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const children = await getChildren();
        const found = children.find((c) => c.id === childId);
        if (!found) {
          toast.error('Enfant introuvable');
          setChildData(null);
          setChildDrawings([]);
          setLoading(false);
          return;
        }
        if (!mounted) return;
        setChildData({ id: found.id, name: found.firstName, birthdate: found.birthDate ?? null, avatarColor: found.color ?? 'var(--bubblegum-pink)' });

        const images = await getImages();
        if (!mounted) return;
        const filtered = images.filter((img) => {
          if (img.childId === childId) return true;
          // Fallback: try to parse description for childId or childName
          if (img.description) {
            try {
              const parsed = JSON.parse(img.description) as any;
              if (parsed?.childId && String(parsed.childId) === String(childId)) return true;
              if (parsed?.childName && parsed.childName === found.firstName) return true;
            } catch {
              // ignore non-json descriptions
              if (typeof img.description === 'string' && img.description.includes(found.firstName)) return true;
            }
          }
          return false;
        });
        setChildDrawings(filtered.map(mapApiImageToDrawing));
      } catch (err: any) {
        console.error('Failed to load child profile', err);
        toast.error(err?.message ?? 'Impossible de charger le profil');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [childId]);

  const stats = [
    { label: 'Total Artworks', value: childDrawings.length, icon: TrendingUp },
    { label: 'This Month', value: childDrawings.filter(d => {
        const dt = new Date(d.date);
        const now = new Date();
        return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
      }).length, icon: Calendar },
    { label: 'Age', value: `${calculateAgeFromBirthdate(childData?.birthdate)} years`, icon: Cake },
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
              style={{ backgroundColor: childData?.avatarColor ?? 'var(--bubblegum-pink)' }}
            >
              {(childData?.name ?? '').charAt(0) || '?'}
            </div>

            <div className="flex-1">
              <h1 className="font-[var(--font-family-heading)] text-5xl mb-2">
                {childData ? `${childData.name}'s Gallery 🎨` : 'Loading...'}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                Celebrating creativity and imagination
              </p>
              <p className="text-sm text-muted-foreground">
                Born {childData?.birthdate ?? 'Unknown'}
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
          onFavoriteToggled={(id, fav) => {
            setChildDrawings((prev) => prev.map((d) => (d.id === id ? { ...d, isFavorite: fav } : d)));
          }}
        />
      )}
    </div>
  );
}

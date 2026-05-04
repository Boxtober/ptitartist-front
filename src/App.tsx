import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MyChildrenPage } from './components/MyChildrenPage';
import { ChildProfilePage } from './components/ChildProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { TimelinePage } from './components/TimelinePage';
import type { Drawing } from './components/GalleryCard';


const initialDrawings: Drawing[] = [
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
    childName: 'Lucas',
    age: 5,
    date: 'April 18, 2026',
    rotation: 1.5,
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
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1583238829800-a72d2a05583c?w=400',
    childName: 'Noah',
    age: 4,
    date: 'April 22, 2026',
    rotation: 2,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1676969937951-0501ef745b22?w=400',
    childName: 'Mia',
    age: 8,
    date: 'April 25, 2026',
    rotation: -1.5,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1697962176820-b52c00e311f1?w=400',
    childName: 'Liam',
    age: 6,
    date: 'April 27, 2026',
    rotation: 1,
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1753739541371-6866e984986a?w=400',
    childName: 'Olivia',
    age: 5,
    date: 'April 28, 2026',
    rotation: -2.5,
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1757671678525-800857e58c6d?w=400',
    childName: 'Ethan',
    age: 7,
    date: 'April 29, 2026',
    rotation: 0.5,
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1754239027382-2e145a685108?w=400',
    childName: 'Ava',
    age: 6,
    date: 'April 30, 2026',
    rotation: -0.5,
  },
];

export default function App() {
  const [drawings, setDrawings] = useState<Drawing[]>(initialDrawings);

  const handleUpload = (file: File, childName: string, age: number) => {
    // Create a URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);

    // Generate random rotation between -3 and 3 degrees
    const rotation = Math.random() * 6 - 3;

    // Create new drawing
    const newDrawing: Drawing = {
      id: Date.now().toString(),
      imageUrl,
      childName,
      age,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      rotation,
    };

    // Add to the beginning of the array
    setDrawings([newDrawing, ...drawings]);

    // Show success toast with confetti effect
    toast.success('🎉 Masterpiece uploaded!', {
      description: `${childName}'s artwork has been added to the gallery`,
      duration: 4000,
    });

    // Optional: Add confetti animation
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB3D9', '#D4C5F9', '#B8F3D8', '#FFF4A3', '#A3D5FF'],
        });
      });
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
 
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '1.5rem',
              padding: '1rem 1.5rem',
            },
          }}
        />

        <Navbar />

  
        <Routes>
          <Route
            path="/"
            element={<HomePage drawings={drawings} onUpload={handleUpload} />}
          />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/children" element={<MyChildrenPage />} />
          <Route path="/child/:childId" element={<ChildProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>


        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFB3D9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>
    </BrowserRouter>
  );
}
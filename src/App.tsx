import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MyChildrenPage, type Child } from './components/MyChildrenPage';
import { ChildProfilePage } from './components/ChildProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { TimelinePage } from './components/TimelinePage';
import Login from './components/Login';
import Register from './components/Register';
import type { Drawing } from './components/types';
import {
  createChild,
  deleteChild,
  getChildren,
  getImages,
  logout,
  uploadImage,
  type ApiChild,
  type ApiImage,
} from './api/auth';
import type { UploadChild } from './components/UploadArea';

function hasToken() {
  return Boolean(localStorage.getItem('token'));
}

function parseDrawingMeta(description?: string | null) {
  if (!description) return { childName: 'Unknown', age: 0 };
  try {
    const parsed = JSON.parse(description) as { childName?: string; age?: number };
    return {
      childName: parsed.childName ?? 'Unknown',
      age: Number(parsed.age ?? 0),
    };
  } catch {
    return { childName: description, age: 0 };
  }
}

function mapApiImageToDrawing(image: ApiImage): Drawing {
  const meta = parseDrawingMeta(image.description);
  return {
    id: image.id,
    imageUrl: image.url,
    childName: image.child?.firstName ?? meta.childName,
    age: meta.age,
    date: new Date(image.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    rotation: (Math.random() * 6) - 3,
    isFavorite: Boolean((image as any).isFavorite),
  };
}

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

function mapApiChildToUi(child: ApiChild, drawingCount = 0): Child {
  const birth = child.birthDate ? new Date(child.birthDate) : null;
  return {
    id: child.id,
    name: child.firstName,
    age: calculateAgeFromBirthdate(child.birthDate),
    birthdate: birth
      ? birth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Unknown',
    artworkCount: drawingCount,
    avatarColor: child.color ?? 'var(--bubblegum-pink)',
  };
}

const publicShowcaseDrawings: Drawing[] = [
  {
    id: 'showcase-1',
    imageUrl: 'https://images.unsplash.com/photo-1761403942462-04b8b97f1fe9?w=400',
    childName: 'Sophie',
    age: 6,
    date: 'April 15, 2026',
    rotation: -2,
  },
  {
    id: 'showcase-2',
    imageUrl: 'https://images.unsplash.com/photo-1761403948893-c6438c52925a?w=400',
    childName: 'Lucas',
    age: 5,
    date: 'April 18, 2026',
    rotation: 1.5,
  },
  {
    id: 'showcase-3',
    imageUrl: 'https://images.unsplash.com/photo-1761403935539-0c971c206f25?w=400',
    childName: 'Emma',
    age: 7,
    date: 'April 20, 2026',
    rotation: -1,
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken());
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [children, setChildren] = useState<Child[]>([]);

  const refreshDrawings = useCallback(async () => {
    try {
      const images = await getImages();
      setDrawings(images.map(mapApiImageToDrawing));
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('401')) {
        logout();
        setIsAuthenticated(false);
      }
      toast.error(error?.message ?? 'Impossible de charger la galerie');
    }
  }, []);

  const refreshChildren = useCallback(async () => {
    try {
      const childrenData = await getChildren();
      const drawingsData = await getImages();
      const countsByChild = drawingsData.reduce<Record<string, number>>((acc, image) => {
        if (image.childId) acc[image.childId] = (acc[image.childId] ?? 0) + 1;
        return acc;
      }, {});
      setChildren(childrenData.map((child) => mapApiChildToUi(child, countsByChild[child.id] ?? 0)));
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('404')) {
        setChildren([]);
        return;
      }
      toast.error(error?.message ?? 'Impossible de charger les enfants');
    }
  }, []);

  const handleImageDeleted = useCallback((imageId: string) => {
    // Optimistically remove from state
    setDrawings((prev) => prev.filter((d) => d.id !== imageId));
    // Refresh children counts asynchronously
    void refreshChildren();
  }, [refreshChildren]);

  const handleToggleFavorite = useCallback((imageId: string, isFav: boolean) => {
    setDrawings((prev) => prev.map((d) => (d.id === imageId ? { ...d, isFavorite: isFav } : d)));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setDrawings([]);
      setChildren([]);
      return;
    }
    void refreshDrawings();
    void refreshChildren();
  }, [isAuthenticated, refreshDrawings, refreshChildren]);

  const handleUpload = async (file: File, child: UploadChild) => {
    try {
      const description = JSON.stringify({ childName: child.name, age: child.age });
      await uploadImage(file, { description, childId: child.id });
      await refreshDrawings();
      await refreshChildren();
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
      toast.success('Masterpiece uploaded!', {
        description: `${child.name}'s artwork has been added to the gallery`,
        duration: 4000,
      });
    } catch (error: any) {
      toast.error(error?.message ?? 'Upload impossible');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleAddChild = async ({ name, birthdate }: { name: string; birthdate: string }) => {
    const colors = [
      'var(--bubblegum-pink)',
      'var(--lavender)',
      'var(--mint-green)',
      'var(--sunny-yellow)',
      'var(--sky-blue)',
    ];
    await createChild({
      firstName: name,
      birthDate: new Date(birthdate).toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    await refreshChildren();
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      await deleteChild(childId);
      await refreshChildren();
      toast.success('Child deleted');
    } catch (error: any) {
      console.error('Delete child failed', error);
      toast.error(error?.message ?? 'Impossible de supprimer l\'enfant');
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

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <>
                  <Navbar isAuthenticated={false} />
                  <Login onSuccess={() => setIsAuthenticated(true)} />
                </>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <>
                  <Navbar isAuthenticated={false} />
                  <Register />
                </>
              )
            }
          />

          <Route
            path="/"
            element={
              <>
                <Navbar isAuthenticated={isAuthenticated} onLogoutClick={isAuthenticated ? handleLogout : undefined} />
                <HomePage
                  drawings={isAuthenticated ? drawings : publicShowcaseDrawings}
                  children={isAuthenticated ? children : []}
                  onUpload={handleUpload}
                  onImageDeleted={handleImageDeleted}
                  onToggleFavorite={handleToggleFavorite}
                  canUpload={isAuthenticated}
                  onGuestActionClick={() => {
                    window.location.assign('/login');
                  }}
                />
              </>
            }
          />
          <Route
            path="/timeline"
            element={isAuthenticated ? <><Navbar isAuthenticated={isAuthenticated} onLogoutClick={handleLogout} /><TimelinePage /></> : <Navigate to="/login" replace />}
          />
          <Route
            path="/children"
            element={
              isAuthenticated ? (
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogoutClick={handleLogout} />
                  <MyChildrenPage
                    children={children}
                    onAddChild={handleAddChild}
                    onDeleteChild={handleDeleteChild}
                  />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/child/:childId"
            element={isAuthenticated ? <><Navbar isAuthenticated={isAuthenticated} onLogoutClick={handleLogout} /><ChildProfilePage /></> : <Navigate to="/login" replace />}
          />
          <Route
            path="/favorites"
            element={isAuthenticated ? (
              <>
                <Navbar isAuthenticated={isAuthenticated} onLogoutClick={handleLogout} />
                <FavoritesPage
                  drawings={drawings}
                  onToggleFavorite={handleToggleFavorite}
                  onImageDeleted={handleImageDeleted}
                />
              </>
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <><Navbar isAuthenticated={isAuthenticated} onLogoutClick={handleLogout} /><SettingsPage /></> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
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
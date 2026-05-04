import { useEffect, useState } from 'react';
import Login from '../components/Login';
import Gallery from '../components/Gallery';
import { getMe } from '../api/auth';

export default function Home() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (user) {
    return <Gallery />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '70vh' }}>
      <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '80%', maxWidth: 420 }}>
          <Login />
        </div>
      </div>
      <div style={{ flex: 1, backgroundImage: "url('https://source.unsplash.com/collection/190727/800x600')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    </div>
  );
}

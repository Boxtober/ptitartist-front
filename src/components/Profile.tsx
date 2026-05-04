import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getMe, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import AddDrawing from './AddDrawing.tsx';
import Button from './ui/Button';
// show a small preview of images (limit 6) and a link to the full gallery

type UserProfile = {
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
};

type User = {
  id: string;
  email: string;
  createdAt: string;
} & UserProfile;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    age: 0,
    avatarUrl: '',
  });

  const [showAdd, setShowAdd] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [previewImages, setPreviewImages] = useState<Array<{ id: string; url: string; createdAt: string; description?: string | null }>>([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);

        setForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          age: data.age ?? 0,
          avatarUrl: data.avatarUrl ?? '',
        });
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  // fetch preview images (limited client-side to 6 most recent)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/images', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return setPreviewImages([]);
        const data = await res.json();
        if (!mounted) return;
        // backend returns already ordered desc; ensure slice
        setPreviewImages((data || []).slice(0, 6));
      } catch (err) {
        console.error('Error loading preview images', err);
      }
    })();
    return () => { mounted = false; };
  }, [refreshGallery]);

  // 2. logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const updateField =
    (field: keyof UserProfile) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'age' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    await fetch('http://localhost:3000/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        age: form.age ? Number(form.age) : null,
        avatarUrl: form.avatarUrl || null,
      }),
    });

    // refresh user après update
    const updated = await getMe();
    setUser(updated);

    setForm({
      firstName: updated.firstName ?? '',
      lastName: updated.lastName ?? '',
      age: updated.age ?? 0,
      avatarUrl: updated.avatarUrl ?? '',
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <motion.div className="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Mon profil</h2>

      {/* lecture simple */}
      <p>Email : {user.email}</p>
      <p>
        Membre depuis :{' '}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
      
      <p> Nom : {user.firstName} {user.lastName}</p>
      <p>Âge : {user.age}</p>
    
        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            style={{ width: 100, height: 100 }}
          />
        )}

      <h3>Modifier mon profil</h3>

      <input
        placeholder="Prénom"
        value={form.firstName}
        onChange={updateField('firstName')}
      />

      <input
        placeholder="Nom"
        value={form.lastName}
        onChange={updateField('lastName')}
      />

      <input
        placeholder="Âge"
        type="number"
        value={form.age}
        onChange={updateField('age')}
      />

      <input
        placeholder="URL avatar"
        value={form.avatarUrl}
        onChange={updateField('avatarUrl')}
      />

  <Button variant="primary" onClick={handleSave}>Sauvegarder</Button>

      <hr />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <Button onClick={() => setShowAdd(true)}>Ajouter un dessin</Button>
  <Button onClick={handleLogout}>Se déconnecter</Button>
        <Button
          onClick={async () => {
            const ok = window.confirm('Êtes-vous sûr.e de vouloir supprimer votre compte ? Cette action est irréversible.');
            if (!ok) return;
            try {
              const token = localStorage.getItem('token');
              const res = await fetch('http://localhost:3000/me', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload?.error || `Erreur ${res.status}`);
              }
              // cleanup local state
              localStorage.removeItem('token');
              navigate('/register');
            } catch (err: any) {
              alert(err?.message || 'Erreur lors de la suppression du compte');
            }
          }}
          style={{ background: '#ffdddd' }}
        >
          Supprimer mon compte
        </Button>
      </div>

      {showAdd && (
        <div style={{ marginTop: 12 }}>
          <AddDrawing
            onClose={() => setShowAdd(false)}
            onUploaded={() => {
              // trigger gallery refresh
              setRefreshGallery((v) => v + 1);
              setShowAdd(false);
            }}
          />
        </div>
      )}

      <hr />

      <section>
        <h3>Mes dessins récents</h3>
        {previewImages.length === 0 ? (
          <p>Aucun dessin pour l'instant.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
            {previewImages.map((img) => (
              <div key={img.id} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                <img src={img.url} alt="dessin" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <Link to="/gallery">Voir la galerie</Link>
        </div>
      </section>
    </motion.div>
  );
}

// import { useEffect, useState } from 'react';
// import { getMe, logout } from '../api/auth';
// import { useNavigate } from 'react-router-dom';

// export default function Profile() {
//   const [user, setUser] = useState<{ id: string; email: string; createdAt: string } | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getMe()
//       .then(setUser)
//       .catch(() => navigate('/login')); // redirige si pas connecté
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!user) return <p>Chargement...</p>;

//   return (
//     <div>
//       <h2>Mon profil</h2>
//       <p>Email : {user.email}</p>
//       <p>Membre depuis : {new Date(user.createdAt).toLocaleDateString()}</p>
//       {/* plus tard : nom, prénom, photo... */}
//       <button onClick={handleLogout}>Se déconnecter</button>
//     </div>
//   );
// }
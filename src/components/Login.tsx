import { useState } from 'react';
import { login } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

function normalizeError(err: any) {
  if (!err) return 'Erreur inconnue';
  if (typeof err === 'string') return err;
  if (err.error) return err.error;
  if (err.message) return err.message;
  return 'Erreur serveur';
}

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
      navigate('/'); // redirige après connexion
    } catch (err: any) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h2>Se connecter</h2>
      <div className="form">
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="actions">
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Traitement...' : 'Se connecter'}
          </Button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="mt-4">
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </motion.div>
  );
}
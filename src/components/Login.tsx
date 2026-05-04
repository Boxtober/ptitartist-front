import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from './ui/Button';
import Alert from './ui/Alert';

function normalizeError(err: any) {
  if (!err) return 'Erreur inconnue';
  if (typeof err === 'string') return err;
  if (err.error) return err.error;
  if (err.message) return err.message;
  return 'Erreur serveur';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/profile'); // redirige après connexion
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
          <Button variant="primary" onClick={handleLogin} disabled={loading}>{loading ? 'Traitement...' : 'Se connecter'}</Button>
        </div>
      </div>
  {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
  {message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}
      <p>Pas encore de compte ? <a href="/register">S'inscrire</a></p>
    </motion.div>
  );
}
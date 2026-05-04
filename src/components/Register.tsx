import { useState } from 'react';
import { register } from '../api/auth';
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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      setMessage('Compte cree ! Connecte-toi pour continuer.');
      navigate('/login');
    } catch (err: any) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Créer un compte</h2>
      <div className="form">
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? 'Traitement...' : "S'inscrire"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert className="mt-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <p className="mt-4">
        Deja un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </motion.div>
  );
}
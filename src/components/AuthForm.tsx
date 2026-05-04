// import { useState } from 'react';
// import { login, register } from '../api/auth';
// import { motion } from 'motion/react';
// import Button from './ui/Button';
// import Alert from './ui/Alert';

// function normalizeError(err: any) {
//   if (!err) return 'Erreur inconnue';
//   if (typeof err === 'string') return err;
//   if (err.error) return err.error;
//   if (err.message) return err.message;
//   return 'Erreur serveur';
// }

// export default function AuthForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const handleRegister = async () => {
//     setError(null);
//     setSuccess(null);
//     setLoading(true);
//     try {
//       await register(email, password);
//       setSuccess('Compte créé ! Pense à vérifier ta boîte mail si nécessaire.');
//     } catch (err: any) {
//       setError(normalizeError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     setError(null);
//     setSuccess(null);
//     setLoading(true);
//     try {
//       await login(email, password);
//       setSuccess('Connecté·e !');
//     } catch (err: any) {
//       setError(normalizeError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div className="authform" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
//       <div style={{ display: 'flex', gap: 8 }}>
//         <Button onClick={handleRegister} disabled={loading}>S'inscrire</Button>
//         <Button variant="primary" onClick={handleLogin} disabled={loading}>{loading ? 'Traitement...' : 'Se connecter'}</Button>
//       </div>

//       {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
//       {success && <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>}
//     </motion.div>
//   );
// }
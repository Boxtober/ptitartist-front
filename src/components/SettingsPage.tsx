import { useEffect, useState } from 'react';
import { getSettings, getMe, updateSettings, exportAll, deleteAccount, logout, type ApiUser } from '../api/auth';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { uploadAvatar, deleteAvatar } from '../api/auth';
import { ImageWithFallback } from './ImageWithFallback';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel } from './ui/alert-dialog';
import { motion } from 'motion/react';
import { Shield, User, Bell, Lock, Download, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [settings, setSettings] = useState({
    isPrivateProfile: true,
    emailReminders: false,
    autoBackup: false,
  });
  const [user, setUser] = useState<ApiUser | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') as string;

  // use canvas-confetti like in App.tsx for a consistent effect
  function runConfetti() {
    if (typeof window === 'undefined') return;
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFB3D9', '#D4C5F9', '#B8F3D8', '#FFF4A3', '#A3D5FF'],
      });
    }).catch(() => {});
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // fetch settings and user in parallel; tolerate one failing
        const [settingsRes, meRes] = await Promise.all([
          getSettings().catch(() => null),
          getMe().catch(() => null),
        ]);

        if (mounted && settingsRes) setSettings((s) => ({ ...s, ...settingsRes }));
        if (mounted && meRes) setUser(meRes as ApiUser);
      } catch (err: any) {
        toast.error(err?.message ?? 'Impossible de charger les paramètres');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Paramètres sauvegardés');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportAll();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ptitartist-export-${new Date().toISOString().slice(0,10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Téléchargement démarré');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur pendant l\'export');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm('Confirme la suppression définitive de ton compte (tous les fichiers seront supprimés).');
    if (!ok) return;
    try {
      await deleteAccount();
      toast.success('Compte supprimé');
      logout();
      window.location.href = '/';
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur suppression');
    }
  };

  const handleAvatarFile = async (file?: File | null) => {
    if (!file) return;
    setAvatarUploading(true);
    try {
      const updated = await uploadAvatar(file);
      setUser(updated as ApiUser);
      toast.success('Avatar mis à jour');
      setAvatarPreview(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const ok = window.confirm("Supprimer la photo de profil ?");
    if (!ok) return;
    try {
      await deleteAvatar();
      setUser((u) => (u ? { ...u, avatarUrl: null } : u));
      toast.success('Avatar supprimé');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur suppression avatar');
    }
  };

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-[var(--font-family-heading)] text-5xl mb-4">Settings ⚙️</h1>
          <p className="text-muted-foreground text-lg">Manage your account and privacy preferences</p>
        </div>

        <div className="space-y-6">
          <motion.div className="bg-white rounded-3xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">Account</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <AlertDialog open={isDialogOpen} onOpenChange={(v) => setIsDialogOpen(v)}>
                  <AlertDialogTrigger asChild>
                    <button
                      className="relative group w-16 h-16 rounded-full overflow-visible bg-muted/10 flex items-center justify-center cursor-pointer transition-all"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      {/* rotating rainbow ring on hover (outside the image) */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-hover:animate-spin"
                        style={{
                          background: 'conic-gradient(#FFB3D9, #D4C5F9, #B8F3D8, #FFF4A3, #A3D5FF)',
                          padding: '2px',
                        }}
                      />

                      <div className="relative z-10 w-16 h-16 rounded-full overflow-hidden bg-white">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="preview" className="w-16 h-16 object-cover" />
                        ) : user?.avatarUrl ? (
                          (() => {
                            const displayAvatar = user.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('data:'))
                              ? user.avatarUrl
                              : `${apiBase}${user.avatarUrl}`;
                            return <ImageWithFallback src={displayAvatar} alt="avatar" className="w-16 h-16 object-cover" />;
                          })()
                        ) : (
                          <User className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                      <div className="flex-1 bg-muted p-8 flex items-center justify-center">
                        <div className="w-64 h-64 rounded-2xl overflow-hidden">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                          ) : user?.avatarUrl ? (
                            (() => {
                              const displayAvatar = user.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('data:'))
                                ? user.avatarUrl
                                : `${apiBase}${user.avatarUrl}`;
                              return <ImageWithFallback src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />;
                            })()
                          ) : (
                            <User className="w-10 h-10 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-96 p-8 flex flex-col min-h-0">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h2 className="font-[var(--font-family-heading)] text-3xl mb-2">Photo de profil</h2>
                            <p className="text-sm text-muted-foreground">Changer ou supprimer votre photo de profil.</p>
                          </div>
                          <AlertDialogCancel asChild>
                            <button className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </AlertDialogCancel>
                        </div>

                        <div className="space-y-3 flex-1 overflow-auto min-h-0">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Utilisateur</p>
                                <p className="font-[var(--font-family-heading)] text-xl break-words">{`${user?.firstName ?? ''}${user?.lastName ? ' ' + user.lastName : ''}`}</p>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground break-words">
                              <p>{user?.email}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (ev: any) => {
                                  const f = ev.target.files?.[0] ?? null;
                                  if (f) {
                                    // validation
                                    if (!f.type.startsWith('image/')) {
                                      setAvatarError('Format non supporté — sélectionne une image');
                                      return;
                                    }
                                    const maxBytes = 3 * 1024 * 1024; // 3MB
                                    if (f.size > maxBytes) {
                                      setAvatarError('Fichier trop volumineux — max 3MB');
                                      return;
                                    }
                                    setAvatarError(null);
                                    setAvatarPreview(URL.createObjectURL(f));
                                    // close dialog immediately to show confetti behind
                                    setIsDialogOpen(false);
                                    handleAvatarFile(f).then(() => {
                                      runConfetti();
                                    });
                                  }
                                };
                                input.click();
                              }}
                              className="w-full py-3 rounded-full bg-secondary hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                              disabled={avatarUploading}
                            >
                              <Download className="w-5 h-5" />
                              <span>{avatarUploading ? 'Upload…' : 'Change Photo'}</span>
                            </button>

                            {user?.avatarUrl && (
                              <button
                                onClick={async () => {
                                  await handleDeleteAvatar();
                                  setIsDialogOpen(false);
                                }}
                                className="w-full py-3 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Remove</span>
                              </button>
                            )}
                            {avatarError && <p className="text-sm text-destructive mt-2">{avatarError}</p>}
                          </div>
                        </div>

                        <div className="mt-6 p-3 rounded-xl bg-accent/20 text-xs text-center text-muted-foreground">
                          🔒 Votre photo reste privée
                        </div>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex-1">
                  <label className="block text-sm mb-2">Parent Name</label>
                  <input type="text" value={`${user?.firstName ?? ''}${user?.lastName ? ' ' + user.lastName : ''}`} readOnly className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none" />
                  <p className="text-sm text-muted-foreground mt-2">Clique sur la photo pour la modifier.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input type="email" value={user?.email ?? ''} readOnly className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm mb-2">Âge</label>
                <input type="text" value={user?.age != null ? String(user.age) : ''} readOnly className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none" />
              </div>

              <Button onClick={saveSettings} disabled={saving}>{saving ? 'Sauvegarde…' : 'Save Changes'}</Button>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"><Shield className="w-5 h-5 text-secondary" /></div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">Privacy & Security</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Private Profile</p>
                    <p className="text-sm text-muted-foreground">Only you can see your children's artwork</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={!!settings.isPrivateProfile} onChange={(e) => setSettings(s => ({ ...s, isPrivateProfile: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-accent/20 border border-accent/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Your data is protected</p>
                    <p className="text-muted-foreground">All artwork is stored securely and never shared publicly. Only you have access to your family's gallery.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><Bell className="w-5 h-5 text-accent-foreground" /></div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded to upload new artwork</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={!!settings.emailReminders} onChange={(e) => setSettings(s => ({ ...s, emailReminders: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-muted-foreground">Automatically backup artwork weekly</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={!!settings.autoBackup} onChange={(e) => setSettings(s => ({ ...s, autoBackup: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><Download className="w-5 h-5 text-primary" /></div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">Data Management</h2>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={handleExport} disabled={exporting}>
                <div className="flex items-center justify-center gap-2"><Download className="w-4 h-4" /><span>{exporting ? 'Préparation…' : 'Download All Artwork'}</span></div>
              </Button>

              <Button className="w-full" variant="destructive" onClick={handleDeleteAccount}>
                <div className="flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /><span>Delete Account</span></div>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

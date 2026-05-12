import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  getSettings,
  getMe,
  updateSettings,
  updateMe,
  exportAll,
  deleteAccount,
  uploadAvatar,
  deleteAvatar,
  type ApiUser,
  API_URL,
} from '../api/auth';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog';
import { AvatarCropModal } from './AvatarCropModal';
import { ImageWithFallback } from './ImageWithFallback';
import { User, Shield, Lock, Bell, Download, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const fileInputRefModal = useRef<HTMLInputElement | null>(null);
  const apiBase = API_URL ?? '';

  const resolveAvatarUrl = (url?: string | null) => {
    if (!url) return '';
    // already an absolute URL or data URI or protocol-relative
    if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('//')) return url;
    // ensure we don't double up slashes when concatenating
    if (apiBase.endsWith('/') && url.startsWith('/')) return apiBase.slice(0, -1) + url;
    if (!apiBase.endsWith('/') && !url.startsWith('/')) return `${apiBase}/${url}`;
    return `${apiBase}${url}`;
  };

  useEffect(() => {
    async function load() {
      try {
        const me = await getMe();
        // DEBUG: print avatarUrl returned by the API to help debug loading issues
        // Remove this log after verification
        // eslint-disable-next-line no-console
        console.log('DEBUG: fetched me.avatarUrl ->', me?.avatarUrl);
  setUser(me);
  setFirstName(me?.firstName ?? '');
  setLastName(me?.lastName ?? '');
  setEmail(me?.email ?? '');
        const s = await getSettings();
        setSettings(s ?? {});
      } catch (err: any) {
        toast.error(err?.message ?? 'Erreur chargement');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // first update basic profile (name/email)
      try {
  const updated = await updateMe({ firstName: firstName || null, lastName: lastName || null, email: email || null });
        setUser(updated as ApiUser);
        toast.success('Profil mis à jour');
      } catch (e: any) {
        toast.error(e?.message ?? 'Erreur mise à jour profil');
      }

      // then update app settings
      await updateSettings(settings);
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAll();
      toast.success('Export started — regarde ton email');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur export');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveCroppedImage = async (croppedImageUrl: string) => {
    try {
      const blob = await fetch(croppedImageUrl).then((r) => r.blob());
      const file = new File([blob], 'avatar.png', { type: blob.type || 'image/png' });
      await uploadAvatar(file);
      const me = await getMe();
      setUser(me);
      setAvatarPreview(null);
      // confetti on successful avatar upload
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFB3D9', '#D4C5F9', '#B8F3D8', '#FFF4A3', '#A3D5FF'],
          });
        });
      }
      // toast.success('Avatar mis à jour');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur upload avatar');
    } finally {
      try {
        URL.revokeObjectURL(croppedImageUrl);
      } catch {}
      setTempImageUrl(null);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setUser((u) => (u ? { ...u, avatarUrl: null } : u));
      toast.success('Avatar deleted');
    } catch (err: any) {
      toast.error(err?.message ?? 'Error deleting avatar');
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
         <div className="relative group">
                  <button
                    onClick={() => fileInputRefModal.current?.click()}
                    className="relative group w-16 h-16 rounded-full overflow-visible bg-muted/10 flex items-center justify-center cursor-pointer transition-all"
                  >
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
                        <ImageWithFallback src={resolveAvatarUrl(user.avatarUrl)} alt="avatar" className="w-16 h-16 object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  <input
                    ref={(el) => {
                      fileInputRefModal.current = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={async (ev) => {
                      const f = ev.target.files?.[0] ?? null;
                      if (!f) return;
                      if (!f.type.startsWith('image/')) {
                        setAvatarError('Format not supported — please select an image');
                        return;
                      }
                      
                      const maxBytes = 6 * 1024 * 1024; // allow a bit larger for cropping
                      if (f.size > maxBytes) {
                        setAvatarError('File too large — max 6MB');
                        return;
                      }
                      setAvatarError(null);
                      const url = URL.createObjectURL(f);
                      setTempImageUrl(url);
                      setShowCropModal(true);
                    }}
                    className="hidden"
                  />

                  {showCropModal && tempImageUrl && (
                    <AvatarCropModal
                      imageUrl={tempImageUrl}
                      onSave={async (croppedUrl) => {
                        await handleSaveCroppedImage(croppedUrl);
                        setShowCropModal(false);
                      }}
                      onClose={() => {
                        setShowCropModal(false);
                        try {
                          if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
                        } catch {}
                        setTempImageUrl(null);
                      }}
                    />
                  )}
                </div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">Account</h2>
            </div>
     <p className="text-sm text-muted-foreground mt-2">Click on the photo to edit it.</p>
             
                  {user?.avatarUrl && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="mt-2 text-sm text-destructive underline">Supprimer la photo</button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la photo de profil ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action supprimera définitivement votre photo de profil.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAvatar}>Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                 
                  {avatarError && <p className="text-sm text-destructive mt-2">{avatarError}</p>}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
            

                <div className="flex-1">
                  <label className="block text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none"
                  />
                  <label className="block text-sm mb-2 mt-3">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none"
                  />
             
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none" />
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                {saving ? 'Sauvegarde…' : 'Save Changes'}
              </Button>
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
                  <input type="checkbox" checked={!!settings.isPrivateProfile} onChange={(e) => setSettings((s: any) => ({ ...s, isPrivateProfile: e.target.checked }))} className="sr-only peer" />
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
                  <input type="checkbox" checked={!!settings.emailReminders} onChange={(e) => setSettings((s: any) => ({ ...s, emailReminders: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-muted-foreground">Automatically backup artwork weekly</p>
                </div>
                <label className="relative inline-flex items-centercursor-pointer">
                  <input type="checkbox" checked={!!settings.autoBackup} onChange={(e) => setSettings((s: any) => ({ ...s, autoBackup: e.target.checked }))} className="sr-only peer" />
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
                <div className="flex items-center justify-center gap-2"><Download className="w-4 h-4" /><span>{exporting ? 'Preparing…' : 'Download All Artwork'}</span></div>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" variant="destructive">
                    <div className="flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /><span>Delete Account</span></div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>This action is irreversible — all your data including artwork will be permanently deleted. Are you sure?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                      try {
                        await deleteAccount();
                        toast.success('Account deleted');
                      } catch (err: any) {
                        toast.error(err?.message ?? 'Error deleting account');
                      }
                    }}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

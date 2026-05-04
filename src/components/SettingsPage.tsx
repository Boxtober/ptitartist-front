import { motion } from 'motion/react';
import { Shield, User, Bell, Lock, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(true);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-[var(--font-family-heading)] text-5xl mb-4">
            Settings ⚙️
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and privacy preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Section */}
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">
                Account
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Parent Name</label>
                <input
                  type="text"
                  defaultValue="Sarah Johnson"
                  className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="sarah@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <button className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">
                Privacy & Security
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Private Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Only you can see your children's artwork
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privateProfile}
                    onChange={(e) => setPrivateProfile(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-accent/20 border border-accent/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Your data is protected</p>
                    <p className="text-muted-foreground">
                      All artwork is stored securely and never shared publicly.
                      Only you have access to your family's gallery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to upload new artwork
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup artwork weekly
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Data Management Section */}
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-[var(--font-family-heading)] text-2xl">
                Data Management
              </h2>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 rounded-2xl bg-secondary hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span>Download All Artwork</span>
              </button>

              <button className="w-full py-3 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

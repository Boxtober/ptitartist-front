import { Palette, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Navbar({ onUploadClick }: { onUploadClick?: () => void }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Gallery', path: '/' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'My Children', path: '/children' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--bubblegum-pink)] via-[var(--lavender)] to-[var(--sky-blue)] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="font-[var(--font-family-heading)] text-2xl text-foreground">
              PtitArtist
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2.5 rounded-full transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary text-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary/90 transition-all hover:scale-105"
              >
                Upload Art
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-6 py-3 rounded-2xl transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary text-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {onUploadClick && (
              <button
                onClick={() => {
                  onUploadClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 rounded-2xl bg-secondary hover:bg-secondary/90 transition-all text-left"
              >
                Upload Art
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

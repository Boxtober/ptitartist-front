import { motion } from 'motion/react';
import { Sparkles, Palette, Wand2, Heart } from 'lucide-react';

type HeroSectionProps = {
  onPrimaryActionClick: () => void;
  primaryActionLabel: string;
};

export function HeroSection({ onPrimaryActionClick, primaryActionLabel }: HeroSectionProps) {
  const floatingIcons = [
    { Icon: Palette, color: 'var(--bubblegum-pink)', delay: 0 },
    { Icon: Wand2, color: 'var(--lavender)', delay: 0.2 },
    { Icon: Heart, color: 'var(--sky-blue)', delay: 0.4 },
    { Icon: Sparkles, color: 'var(--mint-green)', delay: 0.6 },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, color, delay }, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center opacity-30"
              style={{ backgroundColor: color }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          className="font-[var(--font-family-heading)] text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Every little masterpiece
          <br />
          deserves a gallery ✨
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A magical space for parents to upload, showcase, and cherish their children's
          creative artwork
        </motion.p>

        <motion.button
          onClick={onPrimaryActionClick}
          className="group px-8 py-4 rounded-full bg-primary hover:bg-primary/90 transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Palette className="w-5 h-5" />
          <span>{primaryActionLabel}</span>
        </motion.button>

        {/* Decorative wave shape */}
        <motion.div
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.8 }}
        >
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path
              d="M0,50 Q50,20 100,50 T200,50 L200,100 L0,100 Z"
              fill="var(--bubblegum-pink)"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

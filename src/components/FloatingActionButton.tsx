import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-shadow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <Plus className="w-8 h-8" />
    </motion.button>
  );
}

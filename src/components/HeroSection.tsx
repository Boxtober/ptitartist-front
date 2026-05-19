import { motion } from "motion/react";
import banner from "../assets/ptitartist-banner.webp";

type HeroSectionProps = {
  onPrimaryActionClick: () => void;
  primaryActionLabel: string;
};

export function HeroSection({
  onPrimaryActionClick,
  primaryActionLabel,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <img
        src={banner}
        alt="Children artwork gallery"
        className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 " />
      {/* bg-gradient-to-b from-black/30 via-black/50 to-black/70 */}
      {/* Decorative blur */}
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-400/30 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-12">
        <div className="max-w-3xl">
          <motion.h1
            className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Every little
            <br />
            masterpiece deserves
            <br />a gallery ✨
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A magical space for parents to upload, showcase and preserve their
            children's creative artwork forever.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={onPrimaryActionClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                rounded-2xl
                bg-white
                px-8
                py-4
                font-semibold
                text-slate-900
                shadow-2xl
                transition-all
                hover:shadow-white/20
              "
            >
              {primaryActionLabel}
            </motion.button>

            <button
              className="
                rounded-2xl
                border
                border-white/20
                bg-white/10
                px-8
                py-4
                font-medium
                text-white
                backdrop-blur-md
                transition-all
                hover:bg-white/20
              "
            >
              Explore Gallery
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[230px]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <svg
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,50 Q50,20 100,50 T200,50 L200,100 L0,100 Z"
            fill="white"
          />
        </svg>
      </motion.div>
    </section>
  );
}

// import { motion } from "motion/react";
// import { Sparkles, Palette, Wand2, Heart } from "lucide-react";
// import banner from "../assets/ptitartist-banner.webp";

// type HeroSectionProps = {
//   onPrimaryActionClick: () => void;
//   primaryActionLabel: string;
// };

// export function HeroSection({
//   onPrimaryActionClick,
//   primaryActionLabel,
// }: HeroSectionProps) {
//   const floatingIcons = [
//     { Icon: Palette, color: "var(--bubblegum-pink)", delay: 0 },
//     { Icon: Wand2, color: "var(--lavender)", delay: 0.2 },
//     { Icon: Heart, color: "var(--sky-blue)", delay: 0.4 },
//     { Icon: Sparkles, color: "var(--mint-green)", delay: 0.6 },
//   ];

//   return (
//     <section className="relative overflow-hidden">
//       <img
//         src={banner}
//         alt="banner"
//         className="w-full h-auto object-contain pointer-events-none"
//       />

//       {/* Content overlayed on top of the banner */}
//       <div className="absolute inset-0 flex items-center justify-center z-30">
//         <div className="max-w-4xl mx-auto text-center">
//           <motion.h1
//             className="font-[var(--font-family-heading)] text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             Every little masterpiece
//             <br />
//             deserves a gallery ✨
//           </motion.h1>

//           <motion.p
//             className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             A magical space for parents to upload, showcase, and cherish their
//             children's creative artwork
//           </motion.p>

//           <motion.button
//             onClick={onPrimaryActionClick}
//             className="group px-8 py-4 rounded-full bg-primary hover:bg-primary/90 transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Palette className="w-5 h-5" />
//             <span>{primaryActionLabel}</span>
//           </motion.button>

//           {/* Decorative wave shape */}
//           <motion.div
//             className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-32"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.1 }}
//             transition={{ delay: 0.8 }}
//           >
//             <svg viewBox="0 0 200 100" className="w-full h-full">
//               <path
//                 d="M0,50 Q50,20 100,50 T200,50 L200,100 L0,100 Z"
//                 fill="var(--bubblegum-pink)"
//               />
//             </svg>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

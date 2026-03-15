import { motion } from 'framer-motion';
import { useEffect } from 'react';
import emblem from '@/assets/guardian-emblem.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="game-content items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      {/* Emblem */}
      <motion.img
        src={emblem}
        alt="Guardiões da Outorga"
        className="w-24 h-24 md:w-32 md:h-32 mb-6 drop-shadow-2xl"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
        style={{ filter: 'drop-shadow(0 0 20px rgba(186,117,23,0.4))' }}
      />

      {/* Title */}
      <motion.h1
        className="font-playfair font-bold text-center leading-tight"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#F0F7FC', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        GUARDIÕES<br />DA OUTORGA
      </motion.h1>

      <motion.h2
        className="font-playfair italic text-center mt-2"
        style={{ fontSize: 'clamp(20px, 3.5vw, 40px)', color: '#85C1D4', textShadow: '0 1px 10px rgba(0,0,0,0.2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        das Águas do Cerrado
      </motion.h2>

      {/* Wavy separator */}
      <motion.svg
        className="mt-6 mb-6"
        width="220" height="24" viewBox="0 0 220 24"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.6, scaleX: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <path d="M0 12 Q18 4 36 12 T72 12 T108 12 T144 12 T180 12 T220 12" fill="none" stroke="#2A8FAD" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 16 Q28 8 46 16 T82 16 T118 16 T154 16 T190 16 T210 16" fill="none" stroke="#85C1D4" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </motion.svg>

      <motion.p
        className="font-lato text-center max-w-md"
        style={{ fontSize: 'clamp(14px, 2vw, 22px)', color: '#85C1D4', lineHeight: 1.6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        Um jogo educativo sobre recursos hídricos em Goiás
      </motion.p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 8, height: 8, background: '#85C1D4' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;

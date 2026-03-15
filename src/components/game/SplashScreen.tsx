import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="font-playfair font-bold text-branco-nevoa text-center leading-tight" style={{ fontSize: '72px' }}>
        GUARDIÕES DA OUTORGA
      </h1>
      <h2 className="font-playfair italic text-azul-claro text-center mt-4" style={{ fontSize: '40px' }}>
        das Águas do Cerrado
      </h2>

      {/* Wavy separator */}
      <svg className="mt-8 mb-8" width="300" height="20" viewBox="0 0 300 20">
        <path
          d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 T250 10 T300 10"
          fill="none"
          stroke="#2A8FAD"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>

      <p className="font-lato text-azul-claro text-center" style={{ fontSize: '22px' }}>
        Um jogo educativo sobre recursos hídricos em Goiás
      </p>

      {/* Animated waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '120px' }}>
        <svg
          className="animate-wave"
          width="2160"
          height="120"
          viewBox="0 0 2160 120"
          style={{ opacity: 0.2 }}
        >
          <path
            d="M0 60 Q90 20 180 60 T360 60 T540 60 T720 60 T900 60 T1080 60 T1260 60 T1440 60 T1620 60 T1800 60 T1980 60 T2160 60 V120 H0 Z"
            fill="#2A8FAD"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default SplashScreen;

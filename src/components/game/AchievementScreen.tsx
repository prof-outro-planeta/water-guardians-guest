import { motion } from 'framer-motion';
import { Profile, getSealName } from '@/hooks/useGame';

interface AchievementScreenProps {
  stage: number;
  profile: Profile;
  onContinue: () => void;
}

const AchievementScreen = ({ stage, profile, onContinue }: AchievementScreenProps) => {
  const sealName = getSealName(stage, profile);

  const sealConfig = {
    1: {
      gradient: ['#CD7F32', '#A0522D'],
      label: 'Bronze',
      textColor: '#FAEEDA',
    },
    2: {
      gradient: ['#C0C0C0', '#A8A9AD'],
      label: 'Prata',
      textColor: '#F0F7FC',
    },
    3: {
      gradient: ['#FFD700', '#FFA500'],
      label: 'Ouro',
      textColor: '#412402',
    },
  }[stage] || { gradient: ['#CD7F32', '#A0522D'], label: 'Bronze', textColor: '#FAEEDA' };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-playfair font-bold text-branco-nevoa text-center" style={{ fontSize: '36px' }}>
        Conquista Desbloqueada!
      </h2>

      {/* Seal */}
      <motion.div
        className="relative mt-12 flex items-center justify-center"
        style={{ width: '200px', height: '200px' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.3 }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <linearGradient id={`seal-grad-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={sealConfig.gradient[0]} />
              <stop offset="100%" stopColor={sealConfig.gradient[1]} />
            </linearGradient>
            <linearGradient id="shimmer-grad">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="transparent" />
              <animate attributeName="x1" from="-100%" to="100%" dur="2s" repeatCount="indefinite" />
              <animate attributeName="x2" from="0%" to="200%" dur="2s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
          {/* Outer ring */}
          <circle cx="100" cy="100" r="92" fill="none" stroke={sealConfig.gradient[0]} strokeWidth="3" opacity="0.4" />
          {/* Main circle */}
          <circle cx="100" cy="100" r="85" fill={`url(#seal-grad-${stage})`} />
          {/* Shimmer overlay */}
          <circle cx="100" cy="100" r="85" fill="url(#shimmer-grad)" opacity="0.3" />
          {/* Water drop icon */}
          <path
            d="M100 55C100 55 80 80 80 95C80 106 89 115 100 115C111 115 120 106 120 95C120 80 100 55 100 55Z"
            fill={sealConfig.textColor}
            opacity="0.9"
          />
          {/* Star for stage 1, Crown for stage 3 */}
          {stage === 1 && (
            <path
              d="M100 65L103 75L113 75L105 81L108 91L100 85L92 91L95 81L87 75L97 75Z"
              fill={sealConfig.gradient[1]}
              opacity="0.6"
            />
          )}
          {stage === 3 && (
            <path
              d="M85 52L90 42L95 50L100 38L105 50L110 42L115 52Z"
              fill={sealConfig.textColor}
              opacity="0.8"
            />
          )}
        </svg>
      </motion.div>

      <motion.p
        className="font-montserrat font-bold mt-4"
        style={{ fontSize: '20px', color: sealConfig.gradient[0] }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Selo {sealConfig.label}
      </motion.p>

      <motion.h3
        className="font-playfair italic text-center mt-4"
        style={{ fontSize: '28px', color: '#F0F7FC' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {sealName}
      </motion.h3>

      <motion.p
        className="font-lato text-azul-claro text-center mt-4"
        style={{ fontSize: '18px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Você demonstrou conhecimento sobre a gestão dos recursos hídricos!
      </motion.p>

      {/* Celebration particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const colors = ['#85C1D4', '#3B6D11', '#2A8FAD', '#BA7517'];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '8px',
              height: '8px',
              background: colors[i % colors.length],
              top: '50%',
              left: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 150,
              y: Math.sin(angle) * 150,
              opacity: 0,
              scale: 0,
            }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
          />
        );
      })}

      <motion.button
        className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl mt-auto"
        style={{
          height: '72px',
          fontSize: '22px',
          background: sealConfig.gradient[0],
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
      >
        CONTINUAR
      </motion.button>
    </motion.div>
  );
};

export default AchievementScreen;

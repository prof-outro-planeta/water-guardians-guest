import { motion } from 'framer-motion';
import { Profile, getSealName } from '@/hooks/useGame';

interface AchievementScreenProps {
  stage: number;
  profile: Profile;
  onContinue: () => void;
}

const sealConfigs: Record<number, { gradient: [string, string]; label: string; textColor: string; glow: string }> = {
  1: { gradient: ['#CD7F32', '#A0522D'], label: 'Bronze', textColor: '#FAEEDA', glow: 'rgba(205,127,50,0.3)' },
  2: { gradient: ['#C0C0C0', '#A8A9AD'], label: 'Prata', textColor: '#F0F7FC', glow: 'rgba(192,192,192,0.3)' },
  3: { gradient: ['#FFD700', '#FFA500'], label: 'Ouro', textColor: '#412402', glow: 'rgba(255,215,0,0.4)' },
};

const AchievementScreen = ({ stage, profile, onContinue }: AchievementScreenProps) => {
  const sealName = getSealName(stage, profile);
  const config = sealConfigs[stage] || sealConfigs[1];

  return (
    <motion.div
      className="game-content items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Flash celebration overlay */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.05] }}
        transition={{ duration: 1.5 }}
        style={{ background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 5 }}
      />

      <motion.h2
        className="font-playfair font-bold text-center relative z-10"
        style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#F0F7FC' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Conquista Desbloqueada!
      </motion.h2>

      {/* Seal with glow */}
      <motion.div
        className="relative mt-8 flex items-center justify-center"
        style={{ width: '180px', height: '180px' }}
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 120, delay: 0.4 }}
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${config.glow} 0%, transparent 65%)`, filter: 'blur(15px)', transform: 'scale(1.4)' }} />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${config.gradient[0]}30`, animation: 'sealSpin 20s linear infinite' }} />

        <svg width="180" height="180" viewBox="0 0 180 180" className="relative">
          <defs>
            <linearGradient id={`seal-g-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
            <filter id="seal-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={config.gradient[1]} floodOpacity="0.3"/>
            </filter>
          </defs>
          <circle cx="90" cy="90" r="82" fill="none" stroke={config.gradient[0]} strokeWidth="1.5" opacity="0.3" />
          <circle cx="90" cy="90" r="75" fill={`url(#seal-g-${stage})`} filter="url(#seal-shadow)" />
          {/* Inner highlight */}
          <circle cx="90" cy="90" r="75" fill="url(#seal-g-${stage})" opacity="0.1" />
          <ellipse cx="75" cy="65" rx="30" ry="20" fill="rgba(255,255,255,0.15)" transform="rotate(-20 75 65)" />
          {/* Water drop */}
          <path d="M90 50C90 50 72 72 72 84C72 93.9 80.1 102 90 102C99.9 102 108 93.9 108 84C108 72 90 50 90 50Z" fill={config.textColor} opacity="0.85"/>
          {stage === 3 && <path d="M76 46L82 36L86 44L90 32L94 44L98 36L104 46" fill={config.textColor} opacity="0.7" strokeLinejoin="round"/>}
        </svg>
      </motion.div>

      <motion.p
        className="font-montserrat font-bold mt-4 relative z-10"
        style={{ fontSize: '18px', color: config.gradient[0], textShadow: `0 0 10px ${config.glow}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Selo {config.label}
      </motion.p>

      <motion.h3
        className="font-playfair italic text-center mt-3 relative z-10"
        style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#F0F7FC' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        {sealName}
      </motion.h3>

      <motion.p
        className="font-lato text-center mt-3 max-w-sm relative z-10"
        style={{ fontSize: 'clamp(13px, 1.6vw, 17px)', color: '#85C1D4', lineHeight: 1.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        Você demonstrou conhecimento sobre a gestão dos recursos hídricos!
      </motion.p>

      {/* Celebration particles */}
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const colors = ['#85C1D4', '#3B6D11', '#2A8FAD', '#BA7517', '#FFD700', config.gradient[0]];
        const dist = 80 + Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: `${4 + (i % 3) * 2}px`, height: `${4 + (i % 3) * 2}px`, background: colors[i % colors.length], top: '45%', left: '50%', zIndex: 6 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0 }}
            transition={{ delay: 0.6 + Math.random() * 0.3, duration: 1.5 + Math.random(), ease: 'easeOut' }}
          />
        );
      })}

      <motion.button
        className="w-full font-montserrat font-bold rounded-2xl mt-auto relative z-10 overflow-hidden"
        style={{
          height: '56px', fontSize: 'clamp(15px, 2vw, 20px)', color: '#F0F7FC',
          background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`,
          boxShadow: `0 4px 20px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onContinue}
      >
        CONTINUAR
      </motion.button>
    </motion.div>
  );
};

export default AchievementScreen;

import { motion } from 'framer-motion';
import { Profile, getFinalLevel } from '@/hooks/useGame';

interface FinalScreenProps {
  score: number;
  usedHint: boolean;
  sealsEarned: string[];
  profile: Profile;
  onRestart: () => void;
}

const levelConfig: Record<string, { gradient: [string, string]; label: string; glow: string }> = {
  bronze: { gradient: ['#CD7F32', '#A0522D'], label: 'Bronze', glow: 'rgba(205,127,50,0.25)' },
  prata: { gradient: ['#C0C0C0', '#A8A9AD'], label: 'Prata', glow: 'rgba(192,192,192,0.25)' },
  ouro: { gradient: ['#FFD700', '#FFA500'], label: 'Ouro', glow: 'rgba(255,215,0,0.3)' },
  diamante: { gradient: ['#B9F2FF', '#4FC3F7'], label: 'Diamante', glow: 'rgba(185,242,255,0.3)' },
};

const FinalScreen = ({ score, usedHint, sealsEarned, profile, onRestart }: FinalScreenProps) => {
  const level = getFinalLevel(score, usedHint);
  const config = levelConfig[level];

  return (
    <motion.div
      className="game-content items-center overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Celebration overlay */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        style={{ background: `radial-gradient(circle, ${config.glow} 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 5 }}
      />

      <motion.h1
        className="font-playfair font-bold text-center mt-6 relative z-10"
        style={{ fontSize: 'clamp(24px, 4.5vw, 44px)', color: '#F0F7FC', lineHeight: 1.2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Parabéns,<br />Guardião das Águas!
      </motion.h1>

      {/* Score */}
      <motion.div
        className="flex flex-col items-center mt-6 relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', damping: 10 }}
      >
        <span className="font-montserrat font-bold tabular-nums" style={{ fontSize: 'clamp(48px, 10vw, 72px)', color: '#BA7517', textShadow: '0 0 25px rgba(186,117,23,0.3)' }}>
          {score}
        </span>
        <span className="font-montserrat" style={{ fontSize: '18px', color: '#BA7517', opacity: 0.7, marginTop: '-4px' }}>pontos</span>
      </motion.div>

      {/* Level badge */}
      <motion.div
        className="flex flex-col items-center mt-5 relative z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', damping: 12 }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full" style={{ background: config.glow, filter: 'blur(15px)', transform: 'scale(1.5)' }} />
          <svg width="80" height="80" viewBox="0 0 80 80" className="relative">
            <defs>
              <linearGradient id="final-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.gradient[0]} />
                <stop offset="100%" stopColor={config.gradient[1]} />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="url(#final-g)" />
            <ellipse cx="32" cy="30" rx="12" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-15 32 30)" />
            <path d="M40 22C40 22 30 34 30 40C30 45.5 34.5 50 40 50C45.5 50 50 45.5 50 40C50 34 40 22 40 22Z" fill="rgba(255,255,255,0.8)"/>
          </svg>
        </div>
        <p className="font-montserrat font-bold mt-2" style={{ fontSize: '18px', color: config.gradient[0], textShadow: `0 0 8px ${config.glow}` }}>
          Nível {config.label}
        </p>
      </motion.div>

      {/* Seals row */}
      <div className="flex gap-4 mt-6 relative z-10">
        {[1, 2, 3].map((stg, i) => {
          const sealColors = stg === 1 ? ['#CD7F32', '#A0522D'] : stg === 2 ? ['#C0C0C0', '#A8A9AD'] : ['#FFD700', '#FFA500'];
          return (
            <motion.div key={stg} className="flex flex-col items-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 + i * 0.15, type: 'spring', damping: 12 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <defs>
                  <linearGradient id={`ms-${stg}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={sealColors[0]} />
                    <stop offset="100%" stopColor={sealColors[1]} />
                  </linearGradient>
                </defs>
                <circle cx="28" cy="28" r="24" fill={`url(#ms-${stg})`} />
                <path d="M28 16C28 16 22 24 22 28C22 31.3 24.7 34 28 34C31.3 34 34 31.3 34 28C34 24 28 16 28 16Z" fill="rgba(255,255,255,0.8)"/>
              </svg>
              <p className="font-lato text-xs mt-1" style={{ color: '#85C1D4', opacity: 0.7 }}>Etapa {stg}</p>
            </motion.div>
          );
        })}
      </div>

      {/* QR Code */}
      <motion.div className="flex flex-col items-center mt-6 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <div className="rounded-xl flex items-center justify-center" style={{ width: '120px', height: '120px', background: '#FFF' }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <rect x="8" y="8" width="22" height="22" fill="#0D3B5E" rx="3"/>
            <rect x="60" y="8" width="22" height="22" fill="#0D3B5E" rx="3"/>
            <rect x="8" y="60" width="22" height="22" fill="#0D3B5E" rx="3"/>
            <rect x="13" y="13" width="12" height="12" fill="#FFF" rx="1.5"/>
            <rect x="65" y="13" width="12" height="12" fill="#FFF" rx="1.5"/>
            <rect x="13" y="65" width="12" height="12" fill="#FFF" rx="1.5"/>
            <rect x="17" y="17" width="4" height="4" fill="#0D3B5E"/>
            <rect x="69" y="17" width="4" height="4" fill="#0D3B5E"/>
            <rect x="17" y="69" width="4" height="4" fill="#0D3B5E"/>
            <rect x="38" y="38" width="14" height="14" fill="#0D3B5E" rx="2"/>
          </svg>
        </div>
        <p className="font-lato text-center mt-2" style={{ fontSize: '13px', color: '#85C1D4', opacity: 0.7 }}>
          Escaneie para seu certificado digital
        </p>
      </motion.div>

      {/* Final message */}
      <motion.p
        className="font-lato italic text-center mt-5 max-w-sm relative z-10"
        style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: '#85C1D4', lineHeight: 1.6, opacity: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2.3 }}
      >
        "A água é um bem de todos. Sua gestão responsável começa pelo conhecimento."
      </motion.p>

      {/* Restart */}
      <motion.button
        className="w-full font-lato rounded-xl mt-6 mb-4 relative z-10"
        style={{
          height: '50px', fontSize: '16px', color: '#85C1D4',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(133,193,212,0.2)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        whileHover={{ background: 'rgba(255,255,255,0.10)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
      >
        JOGAR NOVAMENTE
      </motion.button>
    </motion.div>
  );
};

export default FinalScreen;

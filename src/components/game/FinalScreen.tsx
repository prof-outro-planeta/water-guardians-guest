import { motion } from 'framer-motion';
import { Profile, getFinalLevel, getSealName } from '@/hooks/useGame';

interface FinalScreenProps {
  score: number;
  usedHint: boolean;
  sealsEarned: string[];
  profile: Profile;
  onRestart: () => void;
}

const levelConfig = {
  bronze: { gradient: ['#CD7F32', '#A0522D'], label: 'Bronze' },
  prata: { gradient: ['#C0C0C0', '#A8A9AD'], label: 'Prata' },
  ouro: { gradient: ['#FFD700', '#FFA500'], label: 'Ouro' },
  diamante: { gradient: ['#B9F2FF', '#4FC3F7'], label: 'Diamante' },
};

const FinalScreen = ({ score, usedHint, sealsEarned, profile, onRestart }: FinalScreenProps) => {
  const level = getFinalLevel(score, usedHint);
  const config = levelConfig[level];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center z-10 overflow-y-auto no-scrollbar"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="font-playfair font-bold text-branco-nevoa text-center mt-8"
        style={{ fontSize: '44px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Parabéns, Guardião das Águas!
      </motion.h1>

      {/* Total score */}
      <motion.div
        className="font-montserrat font-bold text-amber-ipe mt-8 tabular-nums"
        style={{ fontSize: '72px' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', damping: 10 }}
      >
        {score}
      </motion.div>
      <p className="font-montserrat text-amber-ipe" style={{ fontSize: '24px' }}>pontos</p>

      {/* Level badge */}
      <motion.div
        className="mt-8 flex flex-col items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', damping: 12 }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="final-seal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#final-seal)" />
          <path
            d="M50 25C50 25 38 40 38 48C38 54.6 43.4 60 50 60C56.6 60 62 54.6 62 48C62 40 50 25 50 25Z"
            fill="rgba(255,255,255,0.8)"
          />
        </svg>
        <p className="font-montserrat font-bold mt-2" style={{ fontSize: '24px', color: config.gradient[0] }}>
          Nível {config.label}
        </p>
      </motion.div>

      {/* Seals row */}
      <div className="flex gap-6 mt-8">
        {[1, 2, 3].map((stage, i) => (
          <motion.div
            key={stage}
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3 + i * 0.2, type: 'spring', damping: 12 }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80">
              <defs>
                <linearGradient id={`mini-seal-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={stage === 1 ? '#CD7F32' : stage === 2 ? '#C0C0C0' : '#FFD700'} />
                  <stop offset="100%" stopColor={stage === 1 ? '#A0522D' : stage === 2 ? '#A8A9AD' : '#FFA500'} />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="35" fill={`url(#mini-seal-${stage})`} />
              <path
                d="M40 22C40 22 32 34 32 39C32 43.4 35.6 47 40 47C44.4 47 48 43.4 48 39C48 34 40 22 40 22Z"
                fill="rgba(255,255,255,0.8)"
              />
            </svg>
            <p className="font-lato text-azul-claro text-center mt-1" style={{ fontSize: '14px' }}>
              Etapa {stage}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mini map placeholder */}
      <motion.div
        className="mt-8 rounded-2xl overflow-hidden"
        style={{ width: '200px', height: '160px', background: 'rgba(42,143,173,0.15)', border: '1px solid rgba(133,193,212,0.3)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <svg width="200" height="160" viewBox="0 0 200 160">
          {/* Simplified Goiás outline */}
          <path
            d="M60 20 L140 25 L155 60 L150 100 L130 140 L80 145 L50 120 L45 70 Z"
            fill="none"
            stroke="#85C1D4"
            strokeWidth="2"
            opacity="0.5"
          />
          {/* Animated water waves */}
          <path
            d="M70 70 Q90 60 110 70 T150 70"
            fill="none"
            stroke="#2A8FAD"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate attributeName="d" dur="3s" repeatCount="indefinite"
              values="M70 70 Q90 60 110 70 T150 70;M70 72 Q90 64 110 72 T150 72;M70 70 Q90 60 110 70 T150 70"
            />
          </path>
          <path
            d="M80 90 Q100 82 120 90"
            fill="none"
            stroke="#2A8FAD"
            strokeWidth="1.5"
            opacity="0.4"
          >
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="M80 90 Q100 82 120 90;M80 92 Q100 86 120 92;M80 90 Q100 82 120 90"
            />
          </path>
        </svg>
      </motion.div>

      {/* QR Code placeholder */}
      <motion.div
        className="mt-6 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ width: '160px', height: '160px', background: '#FFF', border: '1px solid rgba(133,193,212,0.3)' }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <rect x="10" y="10" width="30" height="30" fill="#0D3B5E" rx="4" />
            <rect x="80" y="10" width="30" height="30" fill="#0D3B5E" rx="4" />
            <rect x="10" y="80" width="30" height="30" fill="#0D3B5E" rx="4" />
            <rect x="16" y="16" width="18" height="18" fill="#FFF" rx="2" />
            <rect x="86" y="16" width="18" height="18" fill="#FFF" rx="2" />
            <rect x="16" y="86" width="18" height="18" fill="#FFF" rx="2" />
            <rect x="22" y="22" width="6" height="6" fill="#0D3B5E" />
            <rect x="92" y="22" width="6" height="6" fill="#0D3B5E" />
            <rect x="22" y="92" width="6" height="6" fill="#0D3B5E" />
            <rect x="50" y="50" width="20" height="20" fill="#0D3B5E" rx="3" />
            <rect x="50" y="10" width="6" height="6" fill="#0D3B5E" />
            <rect x="60" y="20" width="6" height="6" fill="#0D3B5E" />
            <rect x="50" y="30" width="6" height="6" fill="#0D3B5E" />
          </svg>
        </div>
        <p className="font-lato text-azul-claro mt-3 text-center" style={{ fontSize: '16px' }}>
          Escaneie para seu certificado digital
        </p>
      </motion.div>

      {/* Final message */}
      <motion.p
        className="font-lato italic text-azul-claro text-center mt-6"
        style={{ fontSize: '20px', lineHeight: 1.6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        A água é um bem de todos. Sua gestão responsável começa pelo conhecimento.
      </motion.p>

      {/* Restart */}
      <motion.button
        className="w-full font-lato text-azul-claro rounded-xl mt-8 mb-4"
        style={{
          height: '60px',
          fontSize: '20px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid #85C1D4',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
      >
        JOGAR NOVAMENTE
      </motion.button>
    </motion.div>
  );
};

export default FinalScreen;

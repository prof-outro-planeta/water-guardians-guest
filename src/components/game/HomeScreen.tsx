import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';
import emblem from '@/assets/guardian-emblem.png';

interface HomeScreenProps {
  onSelect: (profile: Profile) => void;
}

const WaterDropLeaf = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M24 6C24 6 14 18 14 26C14 31.5 18.5 36 24 36C29.5 36 34 31.5 34 26C34 18 24 6 24 6Z" fill="#3B6D11" opacity="0.85"/>
    <path d="M24 6C24 6 14 18 14 26C14 31.5 18.5 36 24 36" fill="#4A8F16" opacity="0.4"/>
    <path d="M26 28C26 28 32 32 36 28" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="34" cy="24" rx="5" ry="7" fill="#3B6D11" opacity="0.25" transform="rotate(-25 34 24)"/>
    <path d="M32 22C34 18 37 20 38 18" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const WaterDropGear = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M20 6C20 6 10 18 10 26C10 31.5 14.5 36 20 36C25.5 36 30 31.5 30 26C30 18 20 6 20 6Z" fill="#1A6B9A" opacity="0.85"/>
    <path d="M20 6C20 6 10 18 10 26C10 31.5 14.5 36 20 36" fill="#2A8FAD" opacity="0.4"/>
    <circle cx="36" cy="26" r="8" stroke="#1A6B9A" strokeWidth="2" fill="none"/>
    <circle cx="36" cy="26" r="3" fill="#1A6B9A" opacity="0.5"/>
    {[0, 45, 90, 135].map(angle => (
      <line key={angle} x1="36" y1="17" x2="36" y2="19.5" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round"
        transform={`rotate(${angle} 36 26)`}/>
    ))}
  </svg>
);

const WaterDropHouse = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M20 6C20 6 10 18 10 26C10 31.5 14.5 36 20 36C25.5 36 30 31.5 30 26C30 18 20 6 20 6Z" fill="#BA7517" opacity="0.85"/>
    <path d="M20 6C20 6 10 18 10 26C10 31.5 14.5 36 20 36" fill="#D4891A" opacity="0.4"/>
    <path d="M30 25L38 20L46 25" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="32" y="25" width="12" height="10" rx="1.5" stroke="#BA7517" strokeWidth="2" fill="none"/>
    <rect x="36" y="29" width="4" height="6" rx="0.5" fill="#BA7517" opacity="0.4"/>
  </svg>
);

const profiles = [
  {
    id: 'agricultura' as Profile,
    title: 'Agricultura',
    description: 'Captação, irrigação e uso rural da água',
    color: '#3B6D11',
    colorRgb: '59,109,17',
    icon: <WaterDropLeaf />,
  },
  {
    id: 'industria' as Profile,
    title: 'Indústria',
    description: 'Captação e lançamento em processos industriais',
    color: '#1A6B9A',
    colorRgb: '26,107,154',
    icon: <WaterDropGear />,
  },
  {
    id: 'abastecimento' as Profile,
    title: 'Abastecimento Público',
    description: 'Sistemas de abastecimento e poços tubulares',
    color: '#BA7517',
    colorRgb: '186,117,23',
    icon: <WaterDropHouse />,
  },
];

const HomeScreen = ({ onSelect }: HomeScreenProps) => {
  return (
    <motion.div
      className="game-content items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mt-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img src={emblem} alt="" className="w-8 h-8 opacity-80" />
        <span className="font-playfair text-lg" style={{ color: '#85C1D4' }}>Guardiões da Outorga</span>
      </motion.div>

      {/* Title section */}
      <motion.div
        className="text-center mt-8 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="font-playfair font-bold leading-tight" style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#F0F7FC' }}>
          Escolha sua área<br />de atuação
        </h2>
        <p className="font-lato mt-3" style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: '#85C1D4' }}>
          Prove que você é um Guardião das Águas
        </p>
      </motion.div>

      {/* Profile cards */}
      <div className="flex flex-col gap-4 mt-6 w-full flex-1 justify-center">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.id}
            className="relative flex items-center gap-5 w-full text-left rounded-2xl overflow-hidden group"
            style={{
              padding: '20px 24px',
              background: `linear-gradient(135deg, rgba(${profile.colorRgb},0.08) 0%, rgba(255,255,255,0.04) 100%)`,
              border: `1.5px solid rgba(${profile.colorRgb},0.25)`,
              backdropFilter: 'blur(8px)',
              boxShadow: `0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            whileHover={{
              borderColor: profile.color,
              boxShadow: `0 6px 30px rgba(${profile.colorRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.08)`,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(profile.id)}
          >
            {/* Glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at 20% 50%, rgba(${profile.colorRgb},0.1) 0%, transparent 60%)` }}
            />
            <div className="relative flex-shrink-0">{profile.icon}</div>
            <div className="relative">
              <h3 className="font-playfair font-bold" style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#F0F7FC' }}>
                {profile.title}
              </h3>
              <p className="font-lato mt-1" style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: '#85C1D4' }}>
                {profile.description}
              </p>
            </div>
            {/* Arrow */}
            <div className="relative ml-auto flex-shrink-0 opacity-40 group-hover:opacity-80 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#85C1D4" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        className="font-lato opacity-40 mt-4 mb-2 text-center"
        style={{ fontSize: '13px', color: '#85C1D4' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8 }}
      >
        Outorga das Águas do Cerrado — Goiás
      </motion.p>
    </motion.div>
  );
};

export default HomeScreen;

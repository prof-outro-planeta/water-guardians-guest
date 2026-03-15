import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';

interface HomeScreenProps {
  onSelect: (profile: Profile) => void;
}

const profiles = [
  {
    id: 'agricultura' as Profile,
    title: 'Agricultura',
    description: 'Captação, irrigação e uso rural da água',
    color: '#3B6D11',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M28 8C28 8 20 20 20 28C20 32.4 23.6 36 28 36C32.4 36 36 32.4 36 28C36 20 28 8 28 8Z" fill="#3B6D11" opacity="0.9"/>
        <path d="M30 30C30 30 36 34 40 30C40 30 36 28 34 24" stroke="#3B6D11" strokeWidth="2" fill="none"/>
        <path d="M32 26C35 22 38 24 40 22" stroke="#3B6D11" strokeWidth="1.5" fill="none"/>
        <ellipse cx="38" cy="20" rx="4" ry="6" fill="#3B6D11" opacity="0.3" transform="rotate(-30 38 20)"/>
      </svg>
    ),
  },
  {
    id: 'industria' as Profile,
    title: 'Indústria',
    description: 'Captação e lançamento em processos industriais',
    color: '#1A6B9A',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M28 8C28 8 20 20 20 28C20 32.4 23.6 36 28 36C32.4 36 36 32.4 36 28C36 20 28 8 28 8Z" fill="#1A6B9A" opacity="0.9"/>
        <circle cx="38" cy="24" r="8" stroke="#1A6B9A" strokeWidth="2" fill="none"/>
        <circle cx="38" cy="24" r="3" fill="#1A6B9A" opacity="0.4"/>
        <line x1="38" y1="16" x2="38" y2="18" stroke="#1A6B9A" strokeWidth="1.5"/>
        <line x1="38" y1="30" x2="38" y2="32" stroke="#1A6B9A" strokeWidth="1.5"/>
        <line x1="30" y1="24" x2="32" y2="24" stroke="#1A6B9A" strokeWidth="1.5"/>
        <line x1="44" y1="24" x2="46" y2="24" stroke="#1A6B9A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'abastecimento' as Profile,
    title: 'Abastecimento Público',
    description: 'Sistemas de abastecimento e poços tubulares',
    color: '#BA7517',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M28 8C28 8 20 20 20 28C20 32.4 23.6 36 28 36C32.4 36 36 32.4 36 28C36 20 28 8 28 8Z" fill="#BA7517" opacity="0.9"/>
        <rect x="32" y="22" width="14" height="12" rx="2" stroke="#BA7517" strokeWidth="2" fill="none"/>
        <path d="M35 22V18L43 18V22" stroke="#BA7517" strokeWidth="1.5" fill="none"/>
        <rect x="37" y="27" width="4" height="5" rx="0.5" fill="#BA7517" opacity="0.4"/>
      </svg>
    ),
  },
];

const HomeScreen = ({ onSelect }: HomeScreenProps) => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <p className="font-playfair text-branco-nevoa mt-8" style={{ fontSize: '28px' }}>
        Guardiões da Outorga
      </p>

      <div className="mt-16">
        <h2 className="font-lato font-semibold text-branco-nevoa text-center" style={{ fontSize: '32px' }}>
          Escolha sua área de atuação
        </h2>
        <p className="font-lato text-azul-claro text-center mt-3" style={{ fontSize: '20px' }}>
          Prove que você é um Guardião das Águas
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-12 w-full">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.id}
            className="glass-card glass-card-hover flex items-center gap-5 w-full text-left"
            style={{
              height: '140px',
              padding: '24px',
              borderColor: `rgba(133,193,212,0.3)`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            whileHover={{
              borderColor: profile.color,
              boxShadow: `0 0 20px ${profile.color}33`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(profile.id)}
          >
            <div className="flex-shrink-0">{profile.icon}</div>
            <div>
              <h3 className="font-playfair font-bold text-branco-nevoa" style={{ fontSize: '28px' }}>
                {profile.title}
              </h3>
              <p className="font-lato text-azul-claro mt-1" style={{ fontSize: '18px' }}>
                {profile.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="font-lato text-azul-claro mt-auto opacity-60" style={{ fontSize: '16px' }}>
        Outorga das Águas do Cerrado — Goiás
      </p>
    </motion.div>
  );
};

export default HomeScreen;

import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';

interface RulesScreenProps {
  profile: Profile;
  onStart: () => void;
  onBack: () => void;
}

const profileConfig: Record<Profile, { label: string; color: string; colorRgb: string }> = {
  agricultura: { label: 'Agricultura', color: '#3B6D11', colorRgb: '59,109,17' },
  industria: { label: 'Indústria', color: '#1A6B9A', colorRgb: '26,107,154' },
  abastecimento: { label: 'Abastecimento Público', color: '#BA7517', colorRgb: '186,117,23' },
};

const rules = [
  { emoji: '🎯', text: 'O jogo tem 3 etapas progressivas', detail: 'Base → Especializada → Avançada' },
  { emoji: '❓', text: 'Cada etapa tem 5 perguntas', detail: 'Sobre legislação hídrica' },
  { emoji: '📋', text: 'Cada pergunta tem 5 alternativas', detail: 'De A até E' },
  { emoji: '✅', text: 'Apenas 1 alternativa é correta', detail: 'Leia com atenção' },
  { emoji: '🏆', text: 'Acerte pelo menos 4 de 5', detail: 'Para avançar de etapa' },
];

const RulesScreen = ({ profile, onStart, onBack }: RulesScreenProps) => {
  const config = profileConfig[profile];

  return (
    <motion.div
      className="game-content"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45 }}
    >
      {/* Back button */}
      <motion.button
        className="font-lato self-start mb-4 flex items-center gap-2 group"
        style={{ fontSize: '16px', color: '#85C1D4' }}
        onClick={onBack}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:-translate-x-1 transition-transform">
          <path d="M15 10H5M5 10L10 5M5 10L10 15"/>
        </svg>
        Voltar
      </motion.button>

      {/* Profile badge */}
      <motion.div
        className="self-center font-montserrat font-bold rounded-full px-5 py-2"
        style={{
          fontSize: '14px',
          background: `rgba(${config.colorRgb},0.15)`,
          border: `1.5px solid ${config.color}`,
          color: '#F0F7FC',
          boxShadow: `0 0 15px rgba(${config.colorRgb},0.15)`,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        Sua área: {config.label}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-playfair font-bold text-center mt-6"
        style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: '#F0F7FC' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Regras do Jogo
      </motion.h2>

      {/* Rules list */}
      <div className="flex flex-col gap-3 mt-6 flex-1">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-4 rounded-xl relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '14px 18px',
              borderLeft: `3px solid ${config.color}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{rule.emoji}</span>
            <div>
              <span className="font-lato font-semibold block" style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: '#F0F7FC' }}>
                {rule.text}
              </span>
              <span className="font-lato block mt-0.5" style={{ fontSize: 'clamp(12px, 1.5vw, 15px)', color: '#85C1D4', opacity: 0.7 }}>
                {rule.detail}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Start button */}
      <motion.button
        className="w-full font-montserrat font-bold rounded-2xl relative overflow-hidden group"
        style={{
          height: '60px',
          fontSize: 'clamp(16px, 2.2vw, 22px)',
          color: '#F0F7FC',
          background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)`,
          boxShadow: `0 4px 20px rgba(${config.colorRgb},0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
          marginTop: '12px',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02, boxShadow: `0 6px 30px rgba(${config.colorRgb},0.4)` }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
        <span className="relative">INICIAR MISSÃO</span>
      </motion.button>
    </motion.div>
  );
};

export default RulesScreen;

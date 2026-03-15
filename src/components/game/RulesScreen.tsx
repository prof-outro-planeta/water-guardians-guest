import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';

interface RulesScreenProps {
  profile: Profile;
  onStart: () => void;
  onBack: () => void;
}

const profileConfig: Record<Profile, { label: string; color: string }> = {
  agricultura: { label: 'Agricultura', color: '#3B6D11' },
  industria: { label: 'Indústria', color: '#1A6B9A' },
  abastecimento: { label: 'Abastecimento Público', color: '#BA7517' },
};

const rules = [
  { emoji: '🎯', text: 'O jogo tem 3 etapas progressivas' },
  { emoji: '❓', text: 'Cada etapa tem 5 perguntas' },
  { emoji: '📋', text: 'Cada pergunta tem 5 alternativas (A a E)' },
  { emoji: '✅', text: 'Apenas 1 alternativa é correta' },
  { emoji: '🏆', text: 'Acerte pelo menos 4 de 5 para avançar' },
];

const RulesScreen = ({ profile, onStart, onBack }: RulesScreenProps) => {
  const config = profileConfig[profile];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="font-lato text-azul-claro self-start mb-6"
        style={{ fontSize: '20px' }}
        onClick={onBack}
      >
        ← Voltar
      </button>

      <div
        className="self-center font-montserrat font-bold rounded-full px-6 py-2"
        style={{
          fontSize: '16px',
          background: `${config.color}33`,
          border: `1.5px solid ${config.color}`,
          color: '#F0F7FC',
        }}
      >
        Sua área: {config.label}
      </div>

      <h2 className="font-playfair font-bold text-branco-nevoa text-center mt-10" style={{ fontSize: '36px' }}>
        Regras do Jogo
      </h2>

      <div className="flex flex-col gap-3 mt-10">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4"
            style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '16px 20px',
              borderLeft: `3px solid ${config.color}`,
            }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <span style={{ fontSize: '28px' }}>{rule.emoji}</span>
            <span className="font-lato text-branco-nevoa" style={{ fontSize: '22px' }}>
              {rule.text}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="mt-auto w-full font-montserrat font-bold text-branco-nevoa rounded-xl"
        style={{
          height: '72px',
          fontSize: '22px',
          background: config.color,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
      >
        INICIAR MISSÃO
      </motion.button>
    </motion.div>
  );
};

export default RulesScreen;

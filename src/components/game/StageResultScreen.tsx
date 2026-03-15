import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';

interface StageResultScreenProps {
  stage: number;
  stageAnswers: boolean[];
  score: number;
  profile: Profile;
  stageName: string;
  onAdvance: () => void;
}

const profileColors: Record<Profile, { color: string; rgb: string }> = {
  agricultura: { color: '#3B6D11', rgb: '59,109,17' },
  industria: { color: '#1A6B9A', rgb: '26,107,154' },
  abastecimento: { color: '#BA7517', rgb: '186,117,23' },
};

const StageResultScreen = ({ stage, stageAnswers, score, profile, stageName, onAdvance }: StageResultScreenProps) => {
  const theme = profileColors[profile];
  const correctCount = stageAnswers.filter(Boolean).length;
  const passed = correctCount >= 4;
  const stagePoints = stageAnswers.reduce((sum, correct) => correct ? sum + (stage === 1 ? 100 : stage === 2 ? 150 : 250) : sum, 0);

  return (
    <motion.div
      className="game-content items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Stage label */}
      <motion.div
        className="font-montserrat font-bold text-xs tracking-wider px-4 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(133,193,212,0.15)', color: '#85C1D4' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ETAPA {stage} — {stageName}
      </motion.div>

      <motion.h2
        className="font-playfair font-bold text-center mt-6"
        style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#F0F7FC' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Resultado
      </motion.h2>

      {/* Score circles */}
      <div className="flex gap-3 mt-8">
        {stageAnswers.map((correct, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center rounded-full font-montserrat font-bold"
            style={{
              width: 'clamp(44px, 8vw, 60px)', height: 'clamp(44px, 8vw, 60px)',
              background: correct ? 'rgba(59,109,17,0.15)' : 'rgba(153,60,29,0.12)',
              border: `2px solid ${correct ? '#3B6D11' : '#993C1D'}`,
              fontSize: 'clamp(18px, 3vw, 24px)',
              color: correct ? '#7BC443' : '#E8735A',
              boxShadow: correct ? '0 0 15px rgba(59,109,17,0.15)' : '0 0 10px rgba(153,60,29,0.1)',
            }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', damping: 12 }}
          >
            {correct ? '✓' : '✗'}
          </motion.div>
        ))}
      </div>

      {/* Points */}
      <motion.div
        className="flex items-baseline gap-2 mt-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', damping: 10 }}
      >
        <span className="font-montserrat font-bold tabular-nums" style={{ fontSize: 'clamp(40px, 7vw, 56px)', color: '#BA7517', textShadow: '0 0 20px rgba(186,117,23,0.25)' }}>
          {stagePoints}
        </span>
        <span className="font-montserrat" style={{ fontSize: '20px', color: '#BA7517', opacity: 0.7 }}>pts</span>
      </motion.div>

      <motion.p
        className="font-lato mt-2"
        style={{ fontSize: '16px', color: '#85C1D4' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {correctCount} de 5 corretas
      </motion.p>

      {/* Pass/fail */}
      <motion.div
        className="text-center mt-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        {passed ? (
          <p className="font-lato" style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: '#B8E6A0', lineHeight: 1.5 }}>
            🎉 Parabéns! Você {stage < 3 ? 'avançou para a próxima etapa!' : 'concluiu todas as etapas!'}
          </p>
        ) : (
          <div>
            <p className="font-lato" style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: '#F5C4B3', lineHeight: 1.5 }}>
              Você precisa de pelo menos 4 acertos para avançar.
            </p>
            <p className="font-lato mt-3" style={{ fontSize: '15px', color: '#85C1D4', opacity: 0.7 }}>
              Revise os conceitos e tente novamente! 💪
            </p>
          </div>
        )}
      </motion.div>

      {/* Action button */}
      <motion.button
        className="w-full font-montserrat font-bold rounded-2xl mt-auto relative overflow-hidden"
        style={{
          height: '56px', fontSize: 'clamp(15px, 2vw, 20px)', color: '#F0F7FC',
          background: passed
            ? `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)`
            : 'linear-gradient(135deg, #993C1D, #993C1DCC)',
          boxShadow: passed
            ? `0 4px 20px rgba(${theme.rgb},0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
            : '0 4px 20px rgba(153,60,29,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onAdvance}
      >
        {passed ? (stage < 3 ? `AVANÇAR PARA ETAPA ${stage + 1}` : 'VER CONQUISTA') : 'TENTAR NOVAMENTE'}
      </motion.button>
    </motion.div>
  );
};

export default StageResultScreen;

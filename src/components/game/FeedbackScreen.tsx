import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';
import { Question } from '@/data/questions';

interface FeedbackScreenProps {
  isCorrect: boolean;
  pointsEarned: number;
  streakBonus: number;
  streak: number;
  question: Question;
  selectedOption: string;
  profile: Profile;
  isLastQuestion: boolean;
  onNext: () => void;
}

const profileColors: Record<Profile, { color: string; rgb: string }> = {
  agricultura: { color: '#3B6D11', rgb: '59,109,17' },
  industria: { color: '#1A6B9A', rgb: '26,107,154' },
  abastecimento: { color: '#BA7517', rgb: '186,117,23' },
};

const FeedbackScreen = ({
  isCorrect, pointsEarned, streakBonus, streak, question,
  selectedOption, profile, isLastQuestion, onNext,
}: FeedbackScreenProps) => {
  const theme = profileColors[profile];
  const correctOption = question.options.find(o => o.id === question.correct);

  return (
    <motion.div
      className="game-content items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Flash overlay */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: isCorrect ? 'rgba(59,109,17,0.08)' : 'rgba(153,60,29,0.06)',
          pointerEvents: 'none', zIndex: 5,
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 150 }}
        >
          {isCorrect ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(59,109,17,0.2)', filter: 'blur(20px)', transform: 'scale(1.5)' }} />
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="rgba(59,109,17,0.15)" stroke="#3B6D11" strokeWidth="2"/>
                <path d="M22 36L32 46L50 28" stroke="#7BC443" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(153,60,29,0.2)', filter: 'blur(20px)', transform: 'scale(1.5)' }} />
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="rgba(153,60,29,0.15)" stroke="#993C1D" strokeWidth="2"/>
                <path d="M26 26L46 46M46 26L26 46" stroke="#E8735A" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-playfair font-bold text-center mt-5"
          style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: isCorrect ? '#B8E6A0' : '#F5C4B3' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isCorrect ? 'Resposta correta!' : 'Não foi dessa vez'}
        </motion.h2>

        {/* Points */}
        {isCorrect && (
          <motion.div
            className="flex items-baseline gap-2 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="font-montserrat font-bold tabular-nums" style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#BA7517', textShadow: '0 0 15px rgba(186,117,23,0.3)' }}>
              +{pointsEarned}
            </span>
            <span className="font-montserrat" style={{ fontSize: '18px', color: '#BA7517', opacity: 0.7 }}>pts</span>
          </motion.div>
        )}

        {streakBonus > 0 && (
          <motion.p
            className="font-montserrat font-semibold mt-2 px-4 py-1.5 rounded-full"
            style={{ fontSize: '15px', color: '#BA7517', background: 'rgba(186,117,23,0.12)', border: '1px solid rgba(186,117,23,0.25)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            🔥 +{streakBonus} bônus! {streak} acertos seguidos
          </motion.p>
        )}

        {/* Wrong answer: show correct */}
        {!isCorrect && correctOption && (
          <motion.div className="mt-5 w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="font-lato text-sm mb-2" style={{ color: '#85C1D4' }}>A resposta correta era:</p>
            <div className="flex items-center gap-3 rounded-xl p-3.5"
              style={{ background: 'rgba(59,109,17,0.1)', border: '1px dashed rgba(59,109,17,0.4)' }}>
              <div className="flex items-center justify-center rounded-full font-montserrat font-bold flex-shrink-0"
                style={{ width: 30, height: 30, background: 'rgba(59,109,17,0.2)', border: '1.5px solid #3B6D11', fontSize: 13, color: '#7BC443' }}>
                {question.correct}
              </div>
              <span className="font-lato" style={{ fontSize: 'clamp(13px, 1.8vw, 17px)', color: '#E6F1FB' }}>{correctOption.text}</span>
            </div>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          className="mt-5 w-full rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(133,193,212,0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-lato" style={{ fontSize: 'clamp(13px, 1.6vw, 17px)', color: '#85C1D4', lineHeight: 1.6 }}>
            📚 {question.explanation}
          </p>
        </motion.div>

        {/* Next button */}
        <motion.button
          className="w-full font-montserrat font-bold rounded-2xl mt-6 relative overflow-hidden"
          style={{
            height: '56px', fontSize: 'clamp(15px, 2vw, 20px)', color: '#F0F7FC',
            background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)`,
            boxShadow: `0 4px 20px rgba(${theme.rgb},0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
        >
          {isLastQuestion ? 'VER RESULTADO' : 'PRÓXIMA PERGUNTA'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FeedbackScreen;

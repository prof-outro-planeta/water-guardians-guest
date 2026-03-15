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

const profileColors: Record<Profile, string> = {
  agricultura: '#3B6D11',
  industria: '#1A6B9A',
  abastecimento: '#BA7517',
};

const FeedbackScreen = ({
  isCorrect,
  pointsEarned,
  streakBonus,
  streak,
  question,
  selectedOption,
  profile,
  isLastQuestion,
  onNext,
}: FeedbackScreenProps) => {
  const themeColor = profileColors[profile];
  const correctOption = question.options.find(o => o.id === question.correct);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Flash overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: isCorrect
            ? 'rgba(59,109,17,0.12)'
            : 'rgba(153,60,29,0.10)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        >
          {isCorrect ? (
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="#3B6D11" opacity="0.3" />
              <path d="M25 40L35 50L55 30" stroke="#3B6D11" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="#993C1D" opacity="0.3" />
              <path d="M28 28L52 52M52 28L28 52" stroke="#993C1D" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
        </motion.div>

        {/* Title */}
        <h2
          className="font-playfair font-bold text-center mt-6"
          style={{
            fontSize: '40px',
            color: isCorrect ? '#EAF3DE' : '#F5C4B3',
          }}
        >
          {isCorrect ? 'Resposta correta!' : 'Não foi dessa vez'}
        </h2>

        {/* Points */}
        {isCorrect && (
          <motion.div
            className="font-montserrat font-bold text-amber-ipe mt-4 tabular-nums"
            style={{ fontSize: '48px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            +{pointsEarned} pts
          </motion.div>
        )}

        {/* Streak bonus */}
        {streakBonus > 0 && (
          <motion.p
            className="font-montserrat text-amber-ipe mt-2"
            style={{ fontSize: '22px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            +{streakBonus} pts bônus! 🔥 {streak} acertos seguidos
          </motion.p>
        )}

        {/* Correct answer for wrong */}
        {!isCorrect && correctOption && (
          <div className="mt-6 w-full">
            <p className="font-lato text-azul-claro mb-3" style={{ fontSize: '18px' }}>
              A resposta correta era:
            </p>
            <div
              className="flex items-center gap-4 rounded-xl"
              style={{
                padding: '16px 20px',
                background: 'rgba(59,109,17,0.15)',
                border: '1px dashed #3B6D11',
              }}
            >
              <div
                className="flex items-center justify-center rounded-full font-montserrat font-bold flex-shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(59,109,17,0.3)',
                  border: '1.5px solid #3B6D11',
                  fontSize: '16px',
                  color: '#F0F7FC',
                }}
              >
                {question.correct}
              </div>
              <span className="font-lato" style={{ fontSize: '20px', color: '#E6F1FB' }}>
                {correctOption.text}
              </span>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div
          className="mt-6 w-full rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '16px',
          }}
        >
          <p className="font-lato text-azul-claro" style={{ fontSize: '18px', lineHeight: 1.6 }}>
            {question.explanation}
          </p>
        </div>

        {/* Next button */}
        <motion.button
          className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl mt-8"
          style={{ height: '72px', fontSize: '22px', background: themeColor }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
        >
          {isLastQuestion ? 'VER RESULTADO' : 'PRÓXIMA PERGUNTA'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FeedbackScreen;

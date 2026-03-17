import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Profile, getFeedbackDelayMs } from '@/hooks/useGame';
import { Question } from '@/data/questions';

interface FeedbackScreenProps {
  isCorrect: boolean;
  pointsEarned: number;
  streakBonus: number;
  streak: number;
  score: number;
  questionIndex: number;
  stage: number;
  question: Question;
  selectedOption: string;
  profile: Profile;
  isLastQuestion: boolean;
  lives?: number;
  onNext: () => void;
}

const FeedbackScreen = ({
  isCorrect,
  streakBonus,
  streak,
  questionIndex,
  stage,
  question,
  selectedOption,
  profile,
  onNext,
}: FeedbackScreenProps) => {
  const correctOption = question.options.find(o => o.id === question.correct);
  const delayMs = getFeedbackDelayMs(questionIndex, stage);
  const [secondsLeft, setSecondsLeft] = useState(() => Math.ceil(delayMs / 1000));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => onNext(), delayMs);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onNext, delayMs]);

  const handleSkip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    onNext();
  };

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
            ? 'rgba(59,109,17,0.22)'
            : 'rgba(153,60,29,0.2)',
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
              <circle cx="40" cy="40" r="36" fill="#3B6D11" opacity="0.6" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="#5A9B2E" strokeWidth="2" opacity="0.8" />
              <path d="M25 40L35 50L55 30" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="#993C1D" opacity="0.6" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="#B84A2A" strokeWidth="2" opacity="0.8" />
              <path d="M28 28L52 52M52 28L28 52" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
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

        {/* Streak message (points are shown as drops filling the bucket in question screen) */}
        {isCorrect && streak > 0 && (
          <motion.p
            className="font-montserrat text-amber-ipe mt-4"
            style={{ fontSize: '22px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {streakBonus > 0 ? (
              <>Bônus! 🔥 {streak} acertos seguidos</>
            ) : (
              <>🔥 {streak} acertos seguidos</>
            )}
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

        <div className="flex flex-col items-center gap-3 mt-6">
          <p className="font-lato text-azul-claro" style={{ fontSize: '22px' }}>
            Próxima pergunta em <strong className="tabular-nums">{secondsLeft}</strong> s
          </p>
          <motion.button
            type="button"
            className="font-montserrat font-semibold text-branco-nevoa rounded-lg px-6 py-3"
            style={{
              fontSize: '18px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSkip}
          >
            Pular
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackScreen;

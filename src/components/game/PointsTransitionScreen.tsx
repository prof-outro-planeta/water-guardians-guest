import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getPointsTransitionDurationMs } from '@/hooks/useGame';
import ScoreBucket from './ScoreBucket';

const BUCKET_SCALE = 2.8;

interface PointsTransitionScreenProps {
  /** Número de acertos na etapa atual (0–5). */
  correctCount: number;
  stage: number;
  questionIndex: number;
  onComplete: () => void;
}

const PointsTransitionScreen = ({ correctCount, stage, questionIndex, onComplete }: PointsTransitionScreenProps) => {
  const durationMs = getPointsTransitionDurationMs(questionIndex, stage);
  const [secondsLeft, setSecondsLeft] = useState(() => Math.ceil(durationMs / 1000));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => onComplete(), durationMs);
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
  }, [onComplete, durationMs]);

  const handleSkip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    onComplete();
  };

  // Galão das etapas: enche em função do número de acertos (0–5),
  // independente da pontuação em pontos ou bônus de sequência.
  const MAX_QUESTIONS_PER_STAGE = 5;
  const fillLevel = Math.min(1, Math.max(0, correctCount / MAX_QUESTIONS_PER_STAGE));

  const bucketWidth = 48;
  const bucketHeight = 64;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
      >
        <span className="font-lato text-branco-nevoa/90 mb-4" style={{ fontSize: '20px' }}>
          Etapa {stage}
        </span>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: bucketWidth * BUCKET_SCALE,
            height: bucketHeight * BUCKET_SCALE,
          }}
        >
          <ScoreBucket
            fillLevel={fillLevel}
            animateFromZero
            scale={BUCKET_SCALE}
          />
        </div>
      </motion.div>
      <div className="flex flex-col items-center gap-3 mt-8">
        <p className="font-lato text-azul-claro/90 text-center" style={{ fontSize: '22px' }}>
          Continuando em <strong className="tabular-nums">{secondsLeft}</strong> s
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
    </motion.div>
  );
};

export default PointsTransitionScreen;

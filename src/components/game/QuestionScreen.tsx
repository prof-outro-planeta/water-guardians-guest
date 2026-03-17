import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, getDropsCount, getStageMaxScore, getWaterRiseCompleteDelayMs } from '@/hooks/useGame';
import { Question } from '@/data/questions';
import ScoreBucket from './ScoreBucket';

interface QuestionScreenProps {
  question: Question;
  stage: number;
  questionIndex: number;
  score: number;
  stageScore: number;
  stageMaxScore: number;
  profile: Profile;
  lives: number;
  /** Option id to hide (wrong answer from game-over retry). */
  eliminatedOptionId: string | null;
  selectedOption: string | null;
  isAnswered: boolean;
  stageName: string;
  stageAnswers: boolean[];
  lastPointsEarned: number;
  lastStreakBonus: number;
  lastAnswerCorrect: boolean | null;
  onPointsAnimationComplete?: () => void;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

/** SVG drop icon for the life (gota). Full when hasLife, outline/faded when not. */
function GotaIcon({ hasLife }: { hasLife: boolean }) {
  const fill = hasLife ? '#4A9FD4' : 'transparent';
  const stroke = hasLife ? '#6BB5E0' : 'rgba(133,193,212,0.5)';
  const opacity = hasLife ? 1 : 0.5;
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="shrink-0" style={{ opacity }} aria-hidden>
      <path
        d="M14 2C8 12 2 20 2 24c0 6.627 5.373 12 12 12s12-5.373 12-12c0-4-6-12-12-22z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small drop SVG for flying points animation */
function FlyingDropIcon() {
  return (
    <svg width="20" height="26" viewBox="0 0 28 36" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M14 2C8 12 2 20 2 24c0 6.627 5.373 12 12 12s12-5.373 12-12c0-4-6-12-12-22z"
        fill="#5BA3C6"
        stroke="#7EC8E3"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const profileColors: Record<Profile, string> = {
  agricultura: '#3B6D11',
  industria: '#1A6B9A',
  abastecimento: '#BA7517',
};

const WAVE_HEIGHT = 10;
const WAVE_AMPLITUDE = 2;
const WAVE_PERIOD = 20;

/** Retorna o valor Y do topo ondulatório (seno) em um dado X. */
function waveY(x: number) {
  return WAVE_HEIGHT / 2 + WAVE_AMPLITUDE * Math.sin((x / WAVE_PERIOD) * 2 * Math.PI);
}

/** Gera o path SVG da barra com topo ondulatório (senoidal). progress 0..1. */
function getWavyProgressPath(progress: number, width = 100) {
  if (progress <= 0) return '';
  const fillWidth = Math.max(0, Math.min(1, progress)) * width;
  const points: string[] = [];
  for (let x = fillWidth; x >= 0; x -= 1.5) {
    points.push(`${x.toFixed(1)},${waveY(x).toFixed(2)}`);
  }
  const wavePath = points.join(' L ');
  return `M 0 ${WAVE_HEIGHT} L ${fillWidth.toFixed(1)} ${WAVE_HEIGHT} L ${wavePath} L 0 ${WAVE_HEIGHT} Z`;
}

/** Path da trilha (fundo) com o mesmo topo ondulatório. */
function getWavyTrackPath(width = 100) {
  const points: string[] = [];
  for (let x = width; x >= 0; x -= 1.5) {
    points.push(`${x.toFixed(1)},${waveY(x).toFixed(2)}`);
  }
  return `M 0 ${WAVE_HEIGHT} L ${width} ${WAVE_HEIGHT} L ${points.join(' L ')} L 0 ${WAVE_HEIGHT} Z`;
}

type AnimationRects = { from: { x: number; y: number }; to: { x: number; y: number } };

const DROP_SIZE = 20;
const FLY_DURATION = 1.2;
const STAGGER_MS = 80;

const QuestionScreen = ({
  question,
  stage,
  questionIndex,
  score,
  stageScore,
  stageMaxScore,
  profile,
  lives,
  eliminatedOptionId,
  selectedOption,
  isAnswered,
  stageName,
  stageAnswers,
  lastPointsEarned,
  lastStreakBonus,
  lastAnswerCorrect,
  onPointsAnimationComplete,
  onSelect,
  onConfirm,
}: QuestionScreenProps) => {
  const themeColor = profileColors[profile];
  const questionCardRef = useRef<HTMLDivElement>(null);
  const scoreBucketRef = useRef<HTMLDivElement>(null);
  const [animationRects, setAnimationRects] = useState<AnimationRects | null>(null);
  const [displayStageScoreForBucket, setDisplayStageScoreForBucket] = useState(stageScore);
  const hasTriggeredAnimationRef = useRef(false);
  const onCompleteRef = useRef(onPointsAnimationComplete);
  onCompleteRef.current = onPointsAnimationComplete;

  const shouldRunDrops =
    isAnswered && lastAnswerCorrect === true && lastPointsEarned > 0;
  const dropsCount = getDropsCount(lastPointsEarned, lastStreakBonus);

  useEffect(() => {
    if (!shouldRunDrops || hasTriggeredAnimationRef.current) return;
    const card = questionCardRef.current;
    const bucket = scoreBucketRef.current;
    if (!card || !bucket) return;

    const readRects = () => {
      const cardRect = card.getBoundingClientRect();
      const bucketRect = bucket.getBoundingClientRect();
      setDisplayStageScoreForBucket(stageScore - lastPointsEarned - lastStreakBonus);
      setAnimationRects({
        from: {
          x: cardRect.left + cardRect.width / 2 - DROP_SIZE / 2,
          y: cardRect.top + cardRect.height / 2 - DROP_SIZE / 2,
        },
        to: {
          x: bucketRect.left + bucketRect.width / 2 - DROP_SIZE / 2,
          y: bucketRect.top + bucketRect.height / 2 - DROP_SIZE / 2,
        },
      });
      hasTriggeredAnimationRef.current = true;
    };

    const t = requestAnimationFrame(() => {
      requestAnimationFrame(readRects);
    });
    return () => cancelAnimationFrame(t);
  }, [shouldRunDrops, stageScore, lastPointsEarned, lastStreakBonus]);

  const visibleOptions = eliminatedOptionId
    ? question.options.filter((o) => o.id !== eliminatedOptionId)
    : question.options;

  const getOptionState = (optionId: string) => {
    if (!isAnswered) {
      if (selectedOption === optionId) return 'selected';
      return 'normal';
    }
    if (optionId === question.correct) return 'correct';
    if (optionId === selectedOption && optionId !== question.correct) return 'wrong';
    return 'normal';
  };

  const optionStyles: Record<string, { bg: string; border: string; icon?: string; iconBg?: string; iconColor?: string }> = {
    normal: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(133,193,212,0.25)' },
    selected: { bg: `${themeColor}2E`, border: themeColor },
    correct: {
      bg: 'rgba(59,109,17,0.5)',
      border: '#3B6D11',
      icon: '✓',
      iconBg: '#3B6D11',
      iconColor: '#fff',
    },
    wrong: {
      bg: 'rgba(153,60,29,0.45)',
      border: '#993C1D',
      icon: '✗',
      iconBg: '#993C1D',
      iconColor: '#fff',
    },
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-10 pb-4">
        <span className="font-lato text-branco-nevoa" style={{ fontSize: '20px' }}>Guardiões</span>
        <div className="flex flex-col items-center gap-2">
          <span className="font-montserrat font-bold text-branco-nevoa" style={{ fontSize: '18px' }}>
            Etapa {stage} de 3 — {stageName}
          </span>
          {/* Mesmas figuras circulares da tela Regras: círculos com número (bronze, prata, ouro), etapa atual destacada */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => {
              const isCurrent = s === stage;
              const colors: Record<number, string> = { 1: '#CD7F32', 2: '#C0C0C0', 3: '#D4AF37' };
              const size = isCurrent ? 40 : 32;
              return (
                <div
                  key={s}
                  className="rounded-full shrink-0 flex items-center justify-center font-montserrat font-bold text-branco-nevoa transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    background: colors[s],
                    opacity: isCurrent ? 1 : 0.6,
                    boxShadow: isCurrent ? `0 0 0 3px ${colors[s]}99` : 'none',
                    fontSize: isCurrent ? '18px' : '14px',
                  }}
                  title={`Etapa ${s}`}
                >
                  {s}
                </div>
              );
            })}
          </div>
        </div>
        <div ref={scoreBucketRef} className="flex items-center gap-3">
          <GotaIcon hasLife={lives >= 1} />
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-lato text-branco-nevoa/80" style={{ fontSize: '12px' }}>
              Etapa {stage}
            </span>
            <ScoreBucket
              fillLevel={displayStageScoreForBucket / stageMaxScore}
              score={stageScore}
            />
          </div>
        </div>
      </div>

      {/* Flying drops overlay: position fixed so coords match getBoundingClientRect (viewport) */}
      {animationRects && dropsCount > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden>
          {Array.from({ length: dropsCount }, (_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: animationRects.to.x,
                top: animationRects.to.y,
                width: DROP_SIZE,
                height: DROP_SIZE,
              }}
              initial={{
                x: animationRects.from.x - animationRects.to.x,
                y: animationRects.from.y - animationRects.to.y,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [1, 1, 0],
                scale: 1,
              }}
              transition={{
                duration: FLY_DURATION,
                delay: i * (STAGGER_MS / 1000),
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { times: [0, 0.75, 1] },
              }}
              onAnimationComplete={
                i === dropsCount - 1
                  ? () => {
                      setDisplayStageScoreForBucket(stageScore);
                      const delayMs = getWaterRiseCompleteDelayMs(questionIndex, stage);
                      setTimeout(() => onCompleteRef.current?.(), delayMs);
                    }
                  : undefined
              }
            >
              <FlyingDropIcon />
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress bar ondular: trilha, preenchimento, hover brilho e efeito de propagação (shimmer) */}
      <div className="progress-bar-wrap px-12 mb-6" style={{ height: '14px' }}>
        <svg
          viewBox={`0 0 100 ${WAVE_HEIGHT}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Propagação de onda: banda de brilho que percorre a barra da esquerda para a direita */}
            <linearGradient id="progress-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0" stopColor="#fff" stopOpacity="0">
                <animate attributeName="offset" values="-0.5;1.5" dur="2.8s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.25" stopColor="#fff" stopOpacity="0.55">
                <animate attributeName="offset" values="-0.25;1.75" dur="2.8s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.5" stopColor="#fff" stopOpacity="0">
                <animate attributeName="offset" values="0;2" dur="2.8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path d={getWavyTrackPath(100)} fill="rgba(255,255,255,0.2)" />
          <path
            d={getWavyProgressPath((questionIndex + 1) / 5, 100)}
            fill="#1A6B9A"
            style={questionIndex === 0 && !isAnswered ? { animation: 'pulse-glow 1.5s infinite' } : undefined}
          />
          {/* Camada de brilho em propagação sobre o preenchimento */}
          <path
            d={getWavyProgressPath((questionIndex + 1) / 5, 100)}
            fill="url(#progress-shimmer)"
            style={{ pointerEvents: 'none' }}
          />
        </svg>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-12 pb-12">
        <p className="font-lato text-azul-claro mb-4" style={{ fontSize: '18px' }}>
          Pergunta {questionIndex + 1} de 5
        </p>

        {/* Question card */}
        <div
          ref={questionCardRef}
          className="glass-card mb-7"
          style={{ padding: '28px 32px' }}
        >
          <p
            className="font-lato font-semibold text-branco-nevoa leading-relaxed"
            style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', textWrap: 'balance' }}
          >
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {visibleOptions.map(option => {
            const state = getOptionState(option.id);
            const styles = optionStyles[state];
            return (
              <motion.button
                key={option.id}
                className="flex items-center gap-4 w-full text-left rounded-xl transition-all"
                style={{
                  minHeight: '72px',
                  padding: '16px 20px',
                  background: styles.bg,
                  border: `${state === 'selected' || state === 'correct' || state === 'wrong' ? '2' : '1.5'}px solid ${styles.border}`,
                  cursor: isAnswered ? 'default' : 'pointer',
                }}
                whileHover={!isAnswered ? { background: 'rgba(255,255,255,0.14)' } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => !isAnswered && onSelect(option.id)}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-full font-montserrat font-bold"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: styles.iconBg ?? `${themeColor}4D`,
                    border: `2px solid ${styles.border}`,
                    fontSize: '18px',
                    color: styles.iconColor ?? '#F0F7FC',
                  }}
                >
                  {styles.icon || option.id}
                </div>
                <span className="font-lato" style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: '#E6F1FB' }}>
                  {option.text}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Confirm button */}
        <AnimatePresence>
          {selectedOption && !isAnswered && (
            <motion.button
              className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl mt-6"
              style={{ height: '72px', fontSize: '22px', background: themeColor }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
            >
              CONFIRMAR RESPOSTA
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionScreen;

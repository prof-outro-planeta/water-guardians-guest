import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/hooks/useGame';
import { Question } from '@/data/questions';

interface QuestionScreenProps {
  question: Question;
  stage: number;
  questionIndex: number;
  score: number;
  profile: Profile;
  selectedOption: string | null;
  isAnswered: boolean;
  stageName: string;
  stageAnswers: boolean[];
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

const profileColors: Record<Profile, string> = {
  agricultura: '#3B6D11',
  industria: '#1A6B9A',
  abastecimento: '#BA7517',
};

const QuestionScreen = ({
  question,
  stage,
  questionIndex,
  score,
  profile,
  selectedOption,
  isAnswered,
  stageName,
  stageAnswers,
  onSelect,
  onConfirm,
}: QuestionScreenProps) => {
  const themeColor = profileColors[profile];

  const getOptionState = (optionId: string) => {
    if (!isAnswered) {
      if (selectedOption === optionId) return 'selected';
      return 'normal';
    }
    if (optionId === question.correct) return 'correct';
    if (optionId === selectedOption && optionId !== question.correct) return 'wrong';
    return 'normal';
  };

  const optionStyles: Record<string, { bg: string; border: string; icon?: string }> = {
    normal: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(133,193,212,0.25)' },
    selected: { bg: `${themeColor}2E`, border: themeColor },
    correct: { bg: 'rgba(59,109,17,0.25)', border: '#3B6D11', icon: '✓' },
    wrong: { bg: 'rgba(153,60,29,0.20)', border: '#993C1D', icon: '✗' },
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
        <div className="text-center">
          <span className="font-montserrat font-bold text-branco-nevoa" style={{ fontSize: '18px' }}>
            Etapa {stage} de 3 — {stageName}
          </span>
        </div>
        <span className="font-montserrat font-bold text-amber-ipe tabular-nums" style={{ fontSize: '28px' }}>
          {score} pts
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 px-12 mb-6">
        {[0, 1, 2, 3, 4].map(i => {
          const isDone = i < questionIndex || (i < stageAnswers.length);
          const isCurrent = i === questionIndex;
          return (
            <div
              key={i}
              className="flex-1 rounded-full"
              style={{
                height: '6px',
                background: isDone
                  ? themeColor
                  : isCurrent
                  ? themeColor
                  : 'rgba(255,255,255,0.2)',
                transition: 'background 400ms ease',
                ...(isCurrent && !isAnswered ? { animation: 'pulse-glow 1.5s infinite' } : {}),
              }}
            />
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-12 pb-12">
        <p className="font-lato text-azul-claro mb-4" style={{ fontSize: '18px' }}>
          Pergunta {questionIndex + 1} de 5
        </p>

        {/* Question card */}
        <div
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
          {question.options.map(option => {
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
                    background: `${themeColor}4D`,
                    border: `1.5px solid ${themeColor}`,
                    fontSize: '16px',
                    color: '#F0F7FC',
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

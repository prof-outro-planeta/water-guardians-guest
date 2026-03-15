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

const profileColors: Record<Profile, { color: string; rgb: string }> = {
  agricultura: { color: '#3B6D11', rgb: '59,109,17' },
  industria: { color: '#1A6B9A', rgb: '26,107,154' },
  abastecimento: { color: '#BA7517', rgb: '186,117,23' },
};

const QuestionScreen = ({
  question, stage, questionIndex, score, profile,
  selectedOption, isAnswered, stageName, stageAnswers, onSelect, onConfirm,
}: QuestionScreenProps) => {
  const theme = profileColors[profile];

  const getOptionState = (optionId: string) => {
    if (!isAnswered) return selectedOption === optionId ? 'selected' : 'normal';
    if (optionId === question.correct) return 'correct';
    if (optionId === selectedOption && optionId !== question.correct) return 'wrong';
    if (optionId !== question.correct) return 'dimmed';
    return 'normal';
  };

  const optionStyleMap: Record<string, { bg: string; border: string; icon?: string; iconColor?: string }> = {
    normal: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(133,193,212,0.18)' },
    selected: { bg: `rgba(${theme.rgb},0.15)`, border: theme.color },
    correct: { bg: 'rgba(59,109,17,0.2)', border: '#3B6D11', icon: '✓', iconColor: '#7BC443' },
    wrong: { bg: 'rgba(153,60,29,0.15)', border: '#993C1D', icon: '✗', iconColor: '#E8735A' },
    dimmed: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(133,193,212,0.08)' },
  };

  return (
    <motion.div
      className="game-content !p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div>
          <span className="font-montserrat font-bold text-xs tracking-wider" style={{ color: '#85C1D4', letterSpacing: '0.08em' }}>
            ETAPA {stage}/3
          </span>
          <p className="font-lato text-sm" style={{ color: '#F0F7FC', opacity: 0.8 }}>{stageName}</p>
        </div>
        <div className="text-right">
          <span className="font-montserrat font-bold tabular-nums" style={{ fontSize: '22px', color: '#BA7517', textShadow: '0 0 10px rgba(186,117,23,0.3)' }}>
            {score}
          </span>
          <span className="font-montserrat text-xs ml-1" style={{ color: '#BA7517', opacity: 0.7 }}>pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 px-6 py-3">
        {[0, 1, 2, 3, 4].map(i => {
          const done = i < stageAnswers.length;
          const current = i === questionIndex && !isAnswered;
          const wasCorrect = done ? stageAnswers[i] : null;
          return (
            <div key={i} className="flex-1 h-1.5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  transformOrigin: 'left',
                  background: done
                    ? (wasCorrect ? '#3B6D11' : '#993C1D')
                    : current ? theme.color : 'transparent',
                  ...(current && !done ? { animation: 'pulse-glow 1.5s infinite' } : {}),
                }}
                initial={done ? { scaleX: 0 } : {}}
                animate={done ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4 }}
              />
            </div>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6">
        <p className="font-montserrat text-xs tracking-wider mb-3 mt-1" style={{ color: '#85C1D4', opacity: 0.7 }}>
          PERGUNTA {questionIndex + 1} DE 5
        </p>

        {/* Question card */}
        <div className="glass-card-strong p-5 mb-5">
          <p className="font-lato font-semibold leading-relaxed" style={{ fontSize: 'clamp(16px, 2.2vw, 26px)', color: '#F0F7FC', textWrap: 'balance' }}>
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, i) => {
            const st = getOptionState(option.id);
            const styles = optionStyleMap[st];
            return (
              <motion.button
                key={option.id}
                className="flex items-center gap-3 w-full text-left rounded-xl relative overflow-hidden group"
                style={{
                  minHeight: '56px',
                  padding: '12px 16px',
                  background: styles.bg,
                  border: `${st === 'selected' || st === 'correct' || st === 'wrong' ? '2' : '1'}px solid ${styles.border}`,
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 150ms ease',
                  opacity: st === 'dimmed' ? 0.5 : 1,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: st === 'dimmed' ? 0.5 : 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={!isAnswered ? { background: 'rgba(255,255,255,0.10)', scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => !isAnswered && onSelect(option.id)}
              >
                {/* Letter circle */}
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-full font-montserrat font-bold"
                  style={{
                    width: '32px', height: '32px',
                    background: styles.icon ? (st === 'correct' ? 'rgba(59,109,17,0.3)' : 'rgba(153,60,29,0.3)') : `rgba(${theme.rgb},0.2)`,
                    border: `1.5px solid ${styles.icon ? styles.iconColor : theme.color}`,
                    fontSize: '14px',
                    color: styles.icon ? styles.iconColor! : '#F0F7FC',
                    transition: 'all 150ms ease',
                  }}
                >
                  {styles.icon || option.id}
                </div>
                <span className="font-lato" style={{ fontSize: 'clamp(13px, 1.8vw, 20px)', color: st === 'dimmed' ? '#85C1D4' : '#E6F1FB', lineHeight: 1.4 }}>
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
              className="w-full font-montserrat font-bold rounded-2xl mt-5 relative overflow-hidden group"
              style={{
                height: '56px', fontSize: 'clamp(15px, 2vw, 20px)', color: '#F0F7FC',
                background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)`,
                boxShadow: `0 4px 20px rgba(${theme.rgb},0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
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

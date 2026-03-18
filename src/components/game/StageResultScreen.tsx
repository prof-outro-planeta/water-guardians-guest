import { motion } from 'framer-motion';
import { Profile } from '@/hooks/useGame';

interface StageResultScreenProps {
  stage: number;
  stageAnswers: boolean[];
  score: number;
  profile: Profile;
  stageName: string;
  /** Avançar (se aprovado) ou tentar a mesma etapa de novo. */
  onAdvance: () => void;
  /** Voltar ao início (cadastro). Sempre disponível ao final da etapa. */
  onRestartNewPerson: () => void;
}

const profileColors: Record<Profile, string> = {
  agricultura: '#3B6D11',
  industria: '#1A6B9A',
  abastecimento: '#BA7517',
};

const StageResultScreen = ({
  stage,
  stageAnswers,
  score,
  profile,
  stageName,
  onAdvance,
  onRestartNewPerson,
}: StageResultScreenProps) => {
  const themeColor = profileColors[profile];
  const correctCount = stageAnswers.filter(Boolean).length;
  const passed = correctCount >= 4;

  // Calculate stage points
  const stagePoints = stageAnswers.reduce((sum, correct, i) => {
    if (!correct) return sum;
    return sum + (stage === 1 ? 100 : stage === 2 ? 150 : 250);
  }, 0);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-playfair font-bold text-branco-nevoa text-center mt-12" style={{ fontSize: '36px' }}>
        Resultado — Etapa {stage}
      </h2>
      <p className="font-lato text-azul-claro mt-2" style={{ fontSize: '20px' }}>
        {stageName}
      </p>

      {/* Score circles — acerto (verde) e erro (vermelho) com boa leitura */}
      <div className="flex gap-4 mt-12">
        {stageAnswers.map((correct, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center rounded-full font-montserrat font-bold"
            style={{
              width: '60px',
              height: '60px',
              background: correct ? 'rgba(59,109,17,0.55)' : 'rgba(153,60,29,0.5)',
              border: `3px solid ${correct ? '#3B6D11' : '#993C1D'}`,
              fontSize: '26px',
              color: '#fff',
              boxShadow: correct ? '0 0 12px rgba(59,109,17,0.4)' : '0 0 12px rgba(153,60,29,0.35)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.15, type: 'spring', damping: 12 }}
          >
            {correct ? '✓' : '✗'}
          </motion.div>
        ))}
      </div>

      {/* Stage points */}
      <motion.div
        className="font-montserrat font-bold text-amber-ipe mt-10 tabular-nums"
        style={{ fontSize: '56px' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {stagePoints} pts
      </motion.div>

      <p className="font-lato text-azul-claro mt-2" style={{ fontSize: '18px' }}>
        {correctCount} de 5 corretas
      </p>

      {/* Pass/fail message */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        {passed ? (
          <p className="font-lato" style={{ fontSize: '22px', color: '#EAF3DE' }}>
            Parabéns! Você {stage < 3 ? 'avançou para a próxima etapa.' : 'concluiu todas as etapas!'}
          </p>
        ) : (
          <div>
            <p className="font-lato" style={{ fontSize: '22px', color: '#F5C4B3' }}>
              Você precisa acertar pelo menos 4 questões para avançar.
            </p>
            <p className="font-lato text-azul-claro mt-4" style={{ fontSize: '18px' }}>
              Revise os conceitos e tente novamente!
            </p>
          </div>
        )}
      </motion.div>

      {/* Botões: ao passar, só "Avançar"; ao não passar, "Tentar novamente" e "Reiniciar" */}
      <div className="w-full mt-auto flex flex-col gap-3">
        {passed ? (
          <>
            <motion.button
              className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl"
              style={{
                height: '72px',
                fontSize: '22px',
                background: themeColor,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdvance}
            >
              {stage < 3 ? `AVANÇAR PARA ETAPA ${stage + 1}` : 'VER CONQUISTA'}
            </motion.button>

            <motion.button
              className="w-full font-lato text-azul-claro rounded-xl"
              style={{
                height: '56px',
                fontSize: '18px',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid #85C1D4',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestartNewPerson}
            >
              Voltar ao início
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl"
              style={{
                height: '64px',
                fontSize: '20px',
                background: '#993C1D',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdvance}
            >
              Tentar novamente
            </motion.button>
            <motion.button
              className="w-full font-lato text-azul-claro rounded-xl"
              style={{
                height: '56px',
                fontSize: '18px',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid #85C1D4',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestartNewPerson}
            >
              Voltar ao início
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default StageResultScreen;

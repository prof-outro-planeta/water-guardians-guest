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

/** Cores e rótulos das medalhas: etapa 1 = bronze, 2 = prata, 3 = ouro */
const stageMedalConfig: Record<number, { color: string; label: string }> = {
  1: { color: '#CD7F32', label: 'Bronze' },
  2: { color: '#C0C0C0', label: 'Prata' },
  3: { color: '#D4AF37', label: 'Ouro' },
};

/** Bolinha da etapa com cor da medalha (bronze, prata, ouro) + rótulos. */
function StageCircle({
  etapa,
  color,
  medalLabel,
  delay,
  duration,
}: {
  etapa: number;
  color: string;
  medalLabel: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
    >
      <div
        className="rounded-full flex items-center justify-center font-montserrat font-bold text-branco-nevoa shrink-0"
        style={{
          width: 72,
          height: 72,
          background: color,
          fontSize: '28px',
          boxShadow: `0 0 0 2px ${color}99`,
        }}
      >
        {etapa}
      </div>
      <span className="font-lato text-branco-nevoa/90 mt-2 font-semibold" style={{ fontSize: '16px' }}>
        Etapa {etapa}
      </span>
      <span className="font-lato text-branco-nevoa/75 font-medium" style={{ fontSize: '12px' }}>
        {medalLabel}
      </span>
    </motion.div>
  );
}

// Timing (seconds) for the integrated animation — um pouco mais lento
const T = {
  stage1: 0.5,
  line12: 0.85,
  stage2: 0.95,
  line23: 1.35,
  stage3: 1.45,
  vert1: 1.65,
  vert2: 2.35,
  vert3: 3.05,
  perguntaStagger: 0.11,
  alternativasStart: 3.55,
  correctHighlight: 4.15,
  cta: 4.6,
};

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

      <h2 className="font-playfair font-bold text-branco-nevoa text-center mt-8" style={{ fontSize: '38px' }}>
        Regras do Jogo
      </h2>

      {/* Diagrama integrado: etapas alinhadas às colunas de perguntas */}
      <motion.div
        className="mt-8 rounded-2xl p-6 sm:p-10 overflow-x-auto overflow-y-auto min-h-0 flex-1 flex flex-col items-center"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${config.color}40`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        {/* Grid: 3 colunas iguais + 2 conexões — cada etapa alinhada à sua coluna de perguntas */}
        <div
          className="w-full max-w-3xl"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 56px 1fr 56px 1fr',
            gap: 0,
            alignItems: 'start',
            justifyItems: 'center',
          }}
        >
          {/* Coluna 1: Etapa 1 + perguntas */}
          <div className="flex flex-col items-center w-full">
            <StageCircle
              etapa={1}
              color={stageMedalConfig[1].color}
              medalLabel={stageMedalConfig[1].label}
              delay={T.stage1}
              duration={0.5}
            />
            <motion.div
              className="rounded-full shrink-0 mt-3"
              style={{ width: 6, height: 22, background: stageMedalConfig[1].color, transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: T.vert1, duration: 0.35 }}
            />
            <p className="font-lato text-branco-nevoa/85 mt-2.5 font-semibold" style={{ fontSize: '15px' }}>
              Perguntas
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <motion.div
                  key={q}
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: -22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: T.vert1 + 0.22 + (q - 1) * T.perguntaStagger,
                    duration: 0.38,
                  }}
                >
                  <div
                    className="rounded-full shrink-0 flex items-center justify-center font-montserrat font-bold text-branco-nevoa"
                    style={{
                      width: 40,
                      height: 24,
                      background: stageMedalConfig[1].color,
                      opacity: 0.9,
                      fontSize: '13px',
                    }}
                  >
                    {q}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conexão 1 → 2 (bronze → prata) */}
          <div className="flex items-center justify-center pt-9">
            <motion.div
              className="rounded-full shrink-0"
              style={{ width: 56, height: 6, background: stageMedalConfig[1].color, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: T.line12, duration: 0.45 }}
            />
          </div>

          {/* Coluna 2: Etapa 2 + perguntas */}
          <div className="flex flex-col items-center w-full">
            <StageCircle
              etapa={2}
              color={stageMedalConfig[2].color}
              medalLabel={stageMedalConfig[2].label}
              delay={T.stage2}
              duration={0.5}
            />
            <motion.div
              className="rounded-full shrink-0 mt-3"
              style={{ width: 6, height: 22, background: stageMedalConfig[2].color, transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: T.vert2, duration: 0.35 }}
            />
            <p className="font-lato text-branco-nevoa/85 mt-2.5 font-semibold" style={{ fontSize: '15px' }}>
              Perguntas
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <motion.div
                  key={q}
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: -22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: T.vert2 + 0.22 + (q - 1) * T.perguntaStagger,
                    duration: 0.38,
                  }}
                >
                  <div
                    className="rounded-full shrink-0 flex items-center justify-center font-montserrat font-bold text-branco-nevoa"
                    style={{
                      width: 40,
                      height: 24,
                      background: stageMedalConfig[2].color,
                      opacity: 0.9,
                      fontSize: '13px',
                    }}
                  >
                    {q}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conexão 2 → 3 (prata → ouro) */}
          <div className="flex items-center justify-center pt-9">
            <motion.div
              className="rounded-full shrink-0"
              style={{ width: 56, height: 6, background: stageMedalConfig[2].color, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: T.line23, duration: 0.45 }}
            />
          </div>

          {/* Coluna 3: Etapa 3 + perguntas */}
          <div className="flex flex-col items-center w-full">
            <StageCircle
              etapa={3}
              color={stageMedalConfig[3].color}
              medalLabel={stageMedalConfig[3].label}
              delay={T.stage3}
              duration={0.5}
            />
            <motion.div
              className="rounded-full shrink-0 mt-3"
              style={{ width: 6, height: 22, background: stageMedalConfig[3].color, transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: T.vert3, duration: 0.35 }}
            />
            <p className="font-lato text-branco-nevoa/85 mt-2.5 font-semibold" style={{ fontSize: '15px' }}>
              Perguntas
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <motion.div
                  key={q}
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: -22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: T.vert3 + 0.22 + (q - 1) * T.perguntaStagger,
                    duration: 0.38,
                  }}
                >
                  <div
                    className="rounded-full shrink-0 flex items-center justify-center font-montserrat font-bold text-branco-nevoa"
                    style={{
                      width: 40,
                      height: 24,
                      background: stageMedalConfig[3].color,
                      opacity: 0.9,
                      fontSize: '13px',
                    }}
                  >
                    {q}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Ramo: linha para baixo + alternativas A–E (centrado) */}
        <div className="flex flex-col items-center mt-6">
          <motion.div
            className="rounded-full"
            style={{ width: 5, height: 28, background: 'rgba(255,255,255,0.35)', transformOrigin: 'top' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: T.alternativasStart - 0.2, duration: 0.35 }}
          />
          <div className="flex items-center gap-4 sm:gap-5 mt-3">
            {(['A', 'B', 'C', 'D', 'E'] as const).map((letter, i) => {
              const isCorrect = letter === 'C';
              return (
                <motion.div
                  key={letter}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: T.alternativasStart + i * 0.08, duration: 0.4 }}
                >
                  <motion.div
                    className="rounded-full border-2 flex items-center justify-center font-montserrat font-bold shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      minWidth: 52,
                      minHeight: 52,
                      background: isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                      borderColor: isCorrect ? '#22C55E' : 'rgba(255,255,255,0.35)',
                      color: isCorrect ? '#86EFAC' : '#F0F7FC',
                      fontSize: '18px',
                    }}
                    animate={
                      isCorrect
                        ? {
                            background: ['rgba(34,197,94,0.2)', '#22C55E'],
                            borderColor: ['#22C55E', '#16A34A'],
                            color: ['#86EFAC', '#fff'],
                            boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 14px rgba(34, 197, 94, 0)'],
                          }
                        : {}
                    }
                    transition={
                      isCorrect
                        ? { delay: T.correctHighlight, duration: 0.55 }
                        : {}
                    }
                  >
                    {letter}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          <p className="font-lato text-branco-nevoa/80 text-center mt-4" style={{ fontSize: '15px' }}>
            Cada pergunta: 5 alternativas (A a E). Apenas 1 correta.
          </p>
        </div>

        {/* Resumo objetivo: 4 de 5 — troféu ao centro, efeito água suave */}
        <motion.div
          className="rules-trophy-card flex flex-col items-center justify-center gap-3 mt-8 rounded-xl px-8 py-5 self-center overflow-hidden relative"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T.cta - 0.25, duration: 0.5 }}
        >
          <span className="relative z-10" style={{ fontSize: '36px' }}>🏆</span>
          <span className="font-lato text-branco-nevoa text-center relative z-10" style={{ fontSize: '17px' }}>
            Acerte <strong>4 de 5</strong> para avançar
          </span>
        </motion.div>
      </motion.div>

      <motion.button
        className="mt-6 w-full font-montserrat font-bold text-branco-nevoa rounded-xl shrink-0"
        style={{
          height: '76px',
          fontSize: '23px',
          background: config.color,
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: T.cta, duration: 0.5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
      >
        INICIAR MISSÃO
      </motion.button>
    </motion.div>
  );
};

export default RulesScreen;

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { BucketCatchMinigame } from '@/components/game/minigames';

interface GameOverScreenProps {
  onRecoverLife: () => void;
  onGiveUp: () => void;
}

const GameOverScreen = ({ onRecoverLife, onGiveUp }: GameOverScreenProps) => {
  const [minigameOpen, setMinigameOpen] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleMinigameSuccess = useCallback(() => {
    setMinigameOpen(false);
    setShowCongrats(true);
  }, []);

  const handleContinueAfterCongrats = useCallback(() => {
    setShowCongrats(false);
    onRecoverLife();
  }, [onRecoverLife]);

  const handleGiveUpFromMinigame = useCallback(() => {
    setMinigameOpen(false);
    onGiveUp();
  }, [onGiveUp]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center w-full max-w-lg">
        {/* Game over icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden>
            <circle cx="40" cy="40" r="36" fill="#993C1D" opacity="0.3" />
            <path
              d="M28 28L52 52M52 28L28 52"
              stroke="#993C1D"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <h2
          className="font-playfair font-bold text-center mt-6"
          style={{ fontSize: '36px', color: '#F5C4B3' }}
        >
          Game over
        </h2>
        <p
          className="font-lato text-center mt-3"
          style={{ fontSize: '18px', color: 'rgba(234,243,222,0.9)', lineHeight: 1.5 }}
        >
          Você errou duas vezes e perdeu sua gota de vida. Tente recuperar a última gota no minigame
          para continuar na mesma pergunta.
        </p>

        <div className="flex flex-col gap-3 w-full mt-10">
          <motion.button
            className="w-full font-montserrat font-bold text-branco-nevoa rounded-xl py-4"
            style={{ fontSize: '20px', background: '#1A6B9A' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMinigameOpen(true)}
          >
            Recuperar a última gota
          </motion.button>
          <motion.button
            className="w-full font-montserrat font-bold rounded-xl py-4 border-2 border-[#993C1D]"
            style={{ fontSize: '20px', color: '#F5C4B3', background: 'transparent' }}
            whileTap={{ scale: 0.98 }}
            onClick={onGiveUp}
          >
            Desistir
          </motion.button>
        </div>
      </div>

      <Dialog open={minigameOpen} onOpenChange={setMinigameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair">Recuperar a última gota</DialogTitle>
            <DialogDescription>
              Arraste o balde para capturar as gotas e recuperar sua vida.
            </DialogDescription>
          </DialogHeader>
          {minigameOpen && (
            <BucketCatchMinigame
              onSuccess={handleMinigameSuccess}
              onSkip={handleGiveUpFromMinigame}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCongrats} onOpenChange={(open) => !open && setShowCongrats(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-center">
              Você recuperou a última gota!
            </DialogTitle>
            <DialogDescription className="text-center">
              Parabéns! Você conseguiu. Agora terá mais uma chance na mesma pergunta — a alternativa
              que você marcou como errada foi eliminada e essa pergunta valerá metade dos pontos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleContinueAfterCongrats}
              className="font-montserrat font-bold text-branco-nevoa rounded-xl px-8 py-3 transition-opacity hover:opacity-90"
              style={{ background: '#1A6B9A', fontSize: '18px' }}
            >
              Continuar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default GameOverScreen;

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MUNICIPIOS_AGUA_LISTA, buscarMunicipioAgua } from '@/data/geography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MunicipiosAguaListMinigameProps {
  onBack: () => void;
}

const TOTAL = MUNICIPIOS_AGUA_LISTA.length;

export default function MunicipiosAguaListMinigame({ onBack }: MunicipiosAguaListMinigameProps) {
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'dup' | 'wrong'; text: string } | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;
      const match = buscarMunicipioAgua(trimmed);
      if (match) {
        if (found.includes(match)) {
          setMessage({ type: 'dup', text: 'Já está na sua lista!' });
        } else {
          setFound((prev) => [...prev, match].sort((a, b) => a.localeCompare(b)));
          setMessage({ type: 'ok', text: 'Correto! Adicionado à lista.' });
          setInput('');
        }
      } else {
        setMessage({ type: 'wrong', text: 'Não está na lista dos 10. Tente outro.' });
      }
      setTimeout(() => setMessage(null), 2500);
    },
    [input, found]
  );

  const allFound = found.length >= TOTAL;

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="font-playfair font-bold text-branco-nevoa" style={{ fontSize: '24px' }}>
          Quase forca: municípios com nome referente a água
        </h2>
        <p className="font-lato text-branco-nevoa/85 mt-2" style={{ fontSize: '16px' }}>
          Liste os {TOTAL} municípios de Goiás com nomes referentes a água. Digite e confira!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex.: Águas Lindas de Goiás"
          className="font-lato bg-white/10 border-white/25 text-branco-nevoa placeholder:text-branco-nevoa/50 flex-1"
          autoComplete="off"
          aria-label="Nome do município"
        />
        <Button
          type="submit"
          className="font-montserrat bg-white/15 text-branco-nevoa hover:bg-white/25 border border-white/25"
        >
          Registrar
        </Button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-montserrat font-semibold text-center ${
            message.type === 'ok' ? 'text-green-400' : message.type === 'dup' ? 'text-amber-300' : 'text-red-300'
          }`}
          style={{ fontSize: '16px' }}
        >
          {message.text}
        </motion.p>
      )}

      <div className="flex items-center justify-center gap-2">
        <span className="font-montserrat font-bold text-azul-claro tabular-nums" style={{ fontSize: '28px' }}>
          {found.length}/{TOTAL}
        </span>
        <span className="font-lato text-branco-nevoa/80">encontrados</span>
      </div>

      {found.length > 0 && (
        <motion.ul
          className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {found.map((nome, i) => (
            <motion.li
              key={nome}
              className="font-lato text-branco-nevoa flex items-center gap-2"
              style={{ fontSize: '16px' }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="text-green-400 font-medium">✓</span>
              {nome}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {allFound && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-playfair font-bold text-green-400 text-center"
          style={{ fontSize: '20px' }}
        >
          Parabéns! Você encontrou todos os {TOTAL} municípios.
        </motion.p>
      )}

      <div className="flex justify-center pt-2">
        <Button variant="ghost" onClick={onBack} className="font-lato text-branco-nevoa/80 hover:text-branco-nevoa">
          Voltar ao menu
        </Button>
      </div>
    </div>
  );
}

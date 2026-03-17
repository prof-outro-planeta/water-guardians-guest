import React from 'react';
import './VirtualKeyboard.css';

type KeyboardMode = 'text' | 'numeric';

interface OnScreenKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  mode?: KeyboardMode;
  /** Tamanho máximo opcional (útil para telefone) */
  maxLength?: number;
}

const TEXT_LAYOUT: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '@', '.', '-'],
];

const NUMERIC_LAYOUT: string[][] = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0'],
];

const SPECIAL_KEYS = {
  BKSP: '⌫',
  SPACE: 'Espaço',
};

export const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({
  value,
  onChange,
  onClose,
  mode = 'text',
  maxLength,
}) => {
  const handleKeyPress = (key: string) => {
    if (key === 'BKSP') {
      if (!value) return;
      onChange(value.slice(0, -1));
      return;
    }
    if (key === 'SPACE') {
      if (maxLength != null && value.length >= maxLength) return;
      onChange(value + ' ');
      return;
    }

    if (maxLength != null && value.length >= maxLength) return;
    onChange(value + key);
  };

  // Um único evento por toque/clique: evita disparo duplo (touch + mouse) e piscar
  const handlePointer = (e: React.PointerEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleKeyPress(key);
  };

  const layout = mode === 'numeric' ? NUMERIC_LAYOUT : TEXT_LAYOUT;

  return (
    <div className="virtual-keyboard-wrapper" role="group" aria-label="Teclado virtual do jogo">
      <div className="virtual-keyboard-inner">
        <div className="space-y-2">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2 mb-1">
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-[rgba(133,193,212,0.4)] px-3 py-3 text-lg text-[hsl(204_57%_96%)] hover:bg-white/20 active:bg-white/25 transition-colors min-w-[44px] min-h-[44px] touch-manipulation select-none"
                  onPointerDown={(e) => handlePointer(e, key)}
                >
                  {key}
                </button>
              ))}
              {rowIndex === layout.length - 1 && mode === 'numeric' && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-[rgba(133,193,212,0.4)] px-3 py-3 text-lg text-[hsl(204_57%_96%)] hover:bg-white/20 active:bg-white/25 transition-colors min-w-[64px] min-h-[44px] touch-manipulation select-none"
                  onPointerDown={(e) => handlePointer(e, 'BKSP')}
                >
                  {SPECIAL_KEYS.BKSP}
                </button>
              )}
            </div>
          ))}

          {mode === 'text' && (
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-white/10 border border-[rgba(133,193,212,0.4)] px-3 py-3 text-lg text-[hsl(204_57%_96%)] hover:bg-white/20 active:bg-white/25 transition-colors min-h-[44px] touch-manipulation select-none"
                onPointerDown={(e) => handlePointer(e, 'SPACE')}
              >
                {SPECIAL_KEYS.SPACE}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-[rgba(133,193,212,0.4)] px-4 py-3 text-lg text-[hsl(204_57%_96%)] hover:bg-white/20 active:bg-white/25 transition-colors min-h-[44px] touch-manipulation select-none"
                onPointerDown={(e) => handlePointer(e, 'BKSP')}
              >
                {SPECIAL_KEYS.BKSP}
              </button>
            </div>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            className="virtual-keyboard-close font-lato touch-manipulation select-none"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            Concluído
          </button>
        )}
      </div>
    </div>
  );
};

export default OnScreenKeyboard;


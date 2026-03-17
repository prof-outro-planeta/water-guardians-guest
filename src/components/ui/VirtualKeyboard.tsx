import { useRef, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './VirtualKeyboard.css';

export type VirtualKeyboardType = 'text' | 'email' | 'numeric';

const INPUT_NAME = 'default';

const LAYOUT_TEXT = {
  default: [
    '1 2 3 4 5 6 7 8 9 0 {bksp}',
    'q w e r t y u i o p',
    'a s d f g h j k l',
    'z x c v b n m @ . -',
    '{space}',
  ],
};

const LAYOUT_NUMERIC = {
  default: ['7 8 9', '4 5 6', '1 2 3', '{bksp} 0'],
};

export interface VirtualKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  type?: VirtualKeyboardType;
  /** Optional max length (e.g. 11 for phone digits) */
  maxLength?: number;
}

export function VirtualKeyboard({
  value,
  onChange,
  onClose,
  type = 'text',
  maxLength,
}: VirtualKeyboardProps) {
  const keyboardRef = useRef<{ setInput: (value: string, inputName?: string) => void } | null>(null);

  // Sync keyboard input when value prop changes (e.g. when switching fields)
  useEffect(() => {
    const k = keyboardRef.current;
    if (!k?.setInput) return;
    const displayValue = type === 'numeric' ? value.replace(/\D/g, '') : value;
    k.setInput(displayValue, INPUT_NAME);
  }, [value, type]);

  const handleChange = (input: string) => {
    if (type === 'numeric') {
      const digits = input.replace(/\D/g, '');
      const capped = maxLength != null ? digits.slice(0, maxLength) : digits;
      onChange(capped);
    } else {
      onChange(input);
    }
  };

  const layout = type === 'numeric' ? LAYOUT_NUMERIC : LAYOUT_TEXT;
  const displayValue = type === 'numeric' ? value.replace(/\D/g, '') : value;

  return (
    <div className="virtual-keyboard-wrapper" role="group" aria-label="Teclado virtual">
      <div className="virtual-keyboard-inner">
        <Keyboard
          keyboardRef={(r) => {
            keyboardRef.current = r;
          }}
          input={{ [INPUT_NAME]: displayValue }}
          inputName={INPUT_NAME}
          onChange={(input) => {
            const str = typeof input === 'string' ? input : (input as Record<string, string>)[INPUT_NAME] ?? '';
            handleChange(str);
          }}
          onKeyPress={(button) => {
            if (button === '{enter}') onClose();
          }}
          layout={layout}
          theme="hg-theme-default hg-theme-water-guardians"
          display={{
            '{bksp}': '⌫',
            '{space}': 'Espaço',
          }}
          useTouchEvents
          useButtonTag
          disableCaretPositioning
          maxLength={maxLength}
          layoutName="default"
          inputPattern={type === 'numeric' ? /^\d*$/ : undefined}
        />
        <button
          type="button"
          className="virtual-keyboard-close font-lato"
          onClick={onClose}
          aria-label="Fechar teclado"
        >
          Concluído
        </button>
      </div>
    </div>
  );
}

export default VirtualKeyboard;

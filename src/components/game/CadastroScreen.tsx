import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/hooks/useGame';

/*
 * TELA DE CADASTRO — TOTEM / TV TOUCH
 * Para uso em TV touch sem teclado físico: planejado teclado virtual on-screen
 * (abrir ao focar nos campos de texto). Ainda não implementado.
 */

// Proporções e fontes do formulário — ajuste aqui para totem/TV (telas grandes e touch)
const FORM_STYLES = {
  labelFontSize: '24px',
  inputHeight: '72px',
  inputFontSize: '22px',
  areaButtonPadding: '20px 24px',
  areaButtonFontSize: '22px',
  submitButtonHeight: '64px',
  submitButtonFontSize: '22px',
} as const;

/** Aplica máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX conforme dígitos digitados */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const AREA_OPTIONS: { id: Profile; title: string }[] = [
  { id: 'agricultura', title: 'Agricultura' },
  { id: 'industria', title: 'Indústria' },
  { id: 'abastecimento', title: 'Abastecimento Público' },
];

interface CadastroScreenProps {
  onComplete: (name: string, email: string, phone: string, profile: Profile) => void;
}

const CadastroScreen = ({ onComplete }: CadastroScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [touched, setTouched] = useState(false);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPhone(formatPhone(raw));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const trimmedName = name.trim();
    if (!trimmedName || !profile) return;
    onComplete(trimmedName, email.trim(), phone.trim(), profile);
  };

  const isValid = name.trim().length > 0 && profile !== null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center z-10 overflow-y-auto no-scrollbar"
      style={{ padding: '48px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <p className="font-playfair text-branco-nevoa mt-6" style={{ fontSize: '28px' }}>
        Guardiões da Outorga
      </p>

      <div className="mt-8">
        <h2 className="font-lato font-semibold text-branco-nevoa text-center" style={{ fontSize: '32px' }}>
          Cadastro
        </h2>
        <p className="font-lato text-azul-claro text-center mt-3" style={{ fontSize: '20px' }}>
          Preencha seus dados para começar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col gap-5 max-w-lg">
        <div className="space-y-2">
          <Label
            htmlFor="guest-name"
            className="font-lato text-branco-nevoa"
            style={{ fontSize: FORM_STYLES.labelFontSize }}
          >
            Nome *
          </Label>
          <Input
            id="guest-name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 rounded-xl px-4"
            style={{ height: FORM_STYLES.inputHeight, fontSize: FORM_STYLES.inputFontSize }}
            autoFocus
            autoComplete="name"
          />
          {touched && !name.trim() && (
            <p className="font-lato text-amber-500" style={{ fontSize: '18px' }}>
              Informe seu nome para continuar.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="guest-email"
            className="font-lato text-branco-nevoa"
            style={{ fontSize: FORM_STYLES.labelFontSize }}
          >
            E-mail
          </Label>
          <Input
            id="guest-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 rounded-xl px-4"
            style={{ height: FORM_STYLES.inputHeight, fontSize: FORM_STYLES.inputFontSize }}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="guest-phone"
            className="font-lato text-branco-nevoa"
            style={{ fontSize: FORM_STYLES.labelFontSize }}
          >
            Telefone
          </Label>
          <Input
            id="guest-phone"
            type="tel"
            placeholder="(62) 99999-9999"
            value={phone}
            onChange={handlePhoneChange}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 rounded-xl px-4"
            style={{ height: FORM_STYLES.inputHeight, fontSize: FORM_STYLES.inputFontSize }}
            autoComplete="tel"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label
            className="font-lato text-branco-nevoa"
            style={{ fontSize: FORM_STYLES.labelFontSize }}
          >
            Área de atuação *
          </Label>
          <div className="flex flex-col gap-3">
            {AREA_OPTIONS.map((opt) => {
              const isSelected = profile === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  className={`w-full font-lato text-left rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-azul-claro bg-azul-claro/30 text-branco-nevoa shadow-[0_0_0_3px_rgba(133,193,212,0.5)]'
                      : 'glass-card border-[rgba(133,193,212,0.3)] text-branco-nevoa'
                  }`}
                  style={{
                    padding: FORM_STYLES.areaButtonPadding,
                    fontSize: FORM_STYLES.areaButtonFontSize,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setProfile(opt.id)}
                >
                  <span className="flex items-center gap-3">
                    {isSelected && (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-azul-claro text-azul-profundo font-bold"
                        aria-hidden
                      >
                        ✓
                      </span>
                    )}
                    {opt.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
          {touched && !profile && (
            <p className="font-lato text-amber-500" style={{ fontSize: '18px' }}>
              Selecione sua área de atuação.
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          className="glass-card glass-card-hover w-full font-lato font-semibold text-branco-nevoa rounded-xl flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none mt-2"
          style={{
            height: FORM_STYLES.submitButtonHeight,
            fontSize: FORM_STYLES.submitButtonFontSize,
            borderColor: 'rgba(133,193,212,0.3)',
          }}
          whileHover={isValid ? { borderColor: '#85C1D4', boxShadow: '0 0 20px rgba(133,193,212,0.2)' } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          disabled={!isValid}
        >
          Continuar
        </motion.button>
      </form>

      <p className="font-lato text-azul-claro mt-auto opacity-60" style={{ fontSize: '16px' }}>
        Outorga das Águas do Cerrado — Goiás
      </p>
    </motion.div>
  );
};

export default CadastroScreen;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/hooks/useGame';

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

      <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col gap-5 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="guest-name" className="font-lato text-branco-nevoa" style={{ fontSize: '18px' }}>
            Nome *
          </Label>
          <Input
            id="guest-name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 h-14 text-lg rounded-xl px-4"
            autoFocus
            autoComplete="name"
          />
          {touched && !name.trim() && (
            <p className="font-lato text-amber-500 text-sm">Informe seu nome para continuar.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-email" className="font-lato text-branco-nevoa" style={{ fontSize: '18px' }}>
            E-mail <span className="text-azul-claro/80">(opcional)</span>
          </Label>
          <Input
            id="guest-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 h-14 text-lg rounded-xl px-4"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-phone" className="font-lato text-branco-nevoa" style={{ fontSize: '18px' }}>
            Telefone <span className="text-azul-claro/80">(opcional)</span>
          </Label>
          <Input
            id="guest-phone"
            type="tel"
            placeholder="(62) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="glass-card border border-[rgba(133,193,212,0.3)] bg-white/5 text-branco-nevoa placeholder:text-azul-claro/60 h-14 text-lg rounded-xl px-4"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-lato text-branco-nevoa" style={{ fontSize: '18px' }}>
            Área de atuação *
          </Label>
          <div className="flex flex-col gap-2">
            {AREA_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                className={`glass-card w-full font-lato text-left rounded-xl px-4 py-3 border-2 transition-colors ${
                  profile === opt.id
                    ? 'border-azul-claro bg-azul-claro/20 text-branco-nevoa'
                    : 'border-[rgba(133,193,212,0.3)] text-branco-nevoa'
                }`}
                style={{ fontSize: '18px' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfile(opt.id)}
              >
                {opt.title}
              </motion.button>
            ))}
          </div>
          {touched && !profile && (
            <p className="font-lato text-amber-500 text-sm">Selecione sua área de atuação.</p>
          )}
        </div>

        <motion.button
          type="submit"
          className="glass-card glass-card-hover w-full font-lato font-semibold text-branco-nevoa rounded-xl flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none mt-2"
          style={{
            height: '56px',
            fontSize: '20px',
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

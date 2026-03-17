import { Link } from 'react-router-dom';
import WaterBackground from '@/components/game/WaterBackground';
import { Button } from '@/components/ui/button';

interface MapLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MapLayout = ({ children, title = 'Mapa de Goiás' }: MapLayoutProps) => {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(160deg, hsl(206 76% 21%) 0%, hsl(202 71% 35%) 50%, hsl(194 44% 42%) 100%)',
      }}
    >
      <WaterBackground />
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <h1
          className="font-playfair font-bold text-branco-nevoa"
          style={{ fontSize: '28px' }}
        >
          {title}
        </h1>
        <Button
          variant="outline"
          asChild
          className="font-montserrat border-white/30 text-branco-nevoa hover:bg-white/10"
        >
          <Link to="/">Voltar ao jogo</Link>
        </Button>
      </header>
      <main className="relative z-10 flex-1 flex flex-col px-6 pb-8">
        {children}
      </main>
    </div>
  );
};

export default MapLayout;

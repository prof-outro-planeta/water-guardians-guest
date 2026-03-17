import { motion } from 'framer-motion';
import type { MapThemeId } from '@/data/geography';
import { MAP_THEMES } from '@/data/geography';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MapThemeSelectorProps {
  onSelect: (themeId: MapThemeId) => void;
}

const themeIcons: Record<MapThemeId, string> = {
  bacias: '🗺️',
  'cidades-agua': '🏙️',
  rios: '🌊',
  nascentes: '💧',
  'lista-agua': '✏️',
};

export default function MapThemeSelector({ onSelect }: MapThemeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto mt-6">
      {MAP_THEMES.map((theme, i) => (
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card
            className="cursor-pointer border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => onSelect(theme.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="font-playfair text-branco-nevoa flex items-center gap-2" style={{ fontSize: '20px' }}>
                <span aria-hidden>{themeIcons[theme.id]}</span>
                {theme.label}
              </CardTitle>
              <CardDescription className="font-lato text-branco-nevoa/80 text-sm">
                {theme.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

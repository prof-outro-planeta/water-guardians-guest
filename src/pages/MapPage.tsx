import { useState } from 'react';
import MapLayout from '@/components/mapa/MapLayout';
import MapThemeSelector from '@/components/mapa/MapThemeSelector';
import MapChallenge from '@/components/mapa/MapChallenge';
import MunicipiosAguaListMinigame from '@/components/mapa/MunicipiosAguaListMinigame';
import type { MapThemeId } from '@/data/geography';

const MapPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<MapThemeId | null>(null);

  if (selectedTheme === 'lista-agua') {
    return (
      <MapLayout title="Minigame: municípios com água">
        <MunicipiosAguaListMinigame onBack={() => setSelectedTheme(null)} />
      </MapLayout>
    );
  }

  if (selectedTheme) {
    return (
      <MapLayout title="Mapa de Goiás">
        <MapChallenge
          themeId={selectedTheme}
          onBack={() => setSelectedTheme(null)}
        />
      </MapLayout>
    );
  }

  return (
    <MapLayout>
      <p className="font-lato text-branco-nevoa/90 text-center" style={{ fontSize: '18px' }}>
        Escolha um tema para explorar no mapa.
      </p>
      <MapThemeSelector onSelect={setSelectedTheme} />
    </MapLayout>
  );
};

export default MapPage;

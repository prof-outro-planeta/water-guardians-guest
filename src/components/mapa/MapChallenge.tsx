import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapThemeId } from '@/data/geography';
import {
  BACIAS,
  BACIA_COUNT,
  CIDADES_COM_AGUA,
  RIOS_PRINCIPAIS,
  MUNICIPIOS_NASCENTES,
} from '@/data/geography';
import { Button } from '@/components/ui/button';
import GoiasMunicipalitiesLayer, { type MunicipalityFeature, getMunicipalityCode } from './GoiasMunicipalitiesLayer';

const GOIAS_CENTER: [number, number] = [-15.98, -49.86];
const DEFAULT_ZOOM = 7;

type ThemeDataSet = Array<{ id: string; name: string; lat: number; lng: number; points?: [number, number][] }>;

const THEME_DATA: Record<MapThemeId, ThemeDataSet> = {
  bacias: BACIAS,
  'cidades-agua': CIDADES_COM_AGUA,
  rios: RIOS_PRINCIPAIS,
  nascentes: MUNICIPIOS_NASCENTES,
};

interface MapChallengeProps {
  themeId: MapThemeId;
  onBack: () => void;
}

function getRandomTarget<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** GeoJSON Polygon/MultiPolygon: coordinates são [lng, lat]. Retorna true se (lng, lat) está dentro. */
function pointInPolygon(lng: number, lat: number, geometry: MunicipalityFeature['geometry']): boolean {
  if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) return false;
  const coords = geometry.coordinates;
  if (geometry.type === 'Polygon') {
    const rings = coords as number[][][];
    return pointInRing(lng, lat, rings[0]);
  }
  const polygons = coords as number[][][][];
  for (const polygon of polygons) {
    if (pointInRing(lng, lat, polygon[0])) return true;
  }
  return false;
}

/** Ray-casting: point [lng, lat] dentro do ring (array de [lng, lat]). */
function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Retorna todos os pontos do alvo (principal + points) em [lng, lat] para point-in-polygon. */
function getTargetPoints(target: { lat: number; lng: number; points?: [number, number][] }): [number, number][] {
  const main: [number, number][] = [[target.lng, target.lat]];
  const extra = (target.points ?? []).map(([lat, lng]) => [lng, lat] as [number, number]);
  return [...main, ...extra];
}

/** Verifica se algum ponto do alvo está dentro do polígono do feature. */
function municipalityContainsTarget(feature: MunicipalityFeature, target: { lat: number; lng: number; points?: [number, number][] }): boolean {
  const points = getTargetPoints(target);
  return points.some(([lng, lat]) => pointInPolygon(lng, lat, feature.geometry));
}

export default function MapChallenge({ themeId, onBack }: MapChallengeProps) {
  const items = THEME_DATA[themeId];

  const [showBaciasQuiz, setShowBaciasQuiz] = useState(themeId === 'bacias');
  const [baciasQuizAnswer, setBaciasQuizAnswer] = useState<number | null>(null);
  const [target, setTarget] = useState(() => getRandomTarget(items));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctlySelectedCodareas, setCorrectlySelectedCodareas] = useState<Set<string>>(() => new Set());

  const question = useMemo(() => {
    const name = 'shortName' in target && target.shortName ? target.shortName : target.name;
    return `Clique nos municípios onde fica: ${name}`;
  }, [target]);

  const handleMunicipalityClick = useCallback(
    (feature: MunicipalityFeature) => {
      if (feedback === 'wrong') return;
      const codarea = getMunicipalityCode(feature);
      if (correctlySelectedCodareas.has(codarea)) return;
      const correct = municipalityContainsTarget(feature, target);
      if (correct) {
        setCorrectlySelectedCodareas((prev) => new Set(prev).add(codarea));
      } else {
        setFeedback('wrong');
      }
    },
    [target, feedback, correctlySelectedCodareas]
  );

  const nextChallenge = useCallback(() => {
    setFeedback(null);
    setCorrectlySelectedCodareas(new Set());
    setTarget(getRandomTarget(items));
  }, [items]);

  const handleBaciasQuizChoice = useCallback((n: number) => {
    setBaciasQuizAnswer(n);
    if (n === BACIA_COUNT) setShowBaciasQuiz(false);
  }, []);

  const goToMapAfterBaciasQuiz = useCallback(() => {
    setShowBaciasQuiz(false);
  }, []);

  if (themeId === 'bacias' && showBaciasQuiz) {
    const correct = baciasQuizAnswer === BACIA_COUNT;
    return (
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        <p className="font-lato text-branco-nevoa text-center" style={{ fontSize: '18px' }}>
          Quantas bacias hidrográficas (comitês de bacia) tem Goiás?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[6, 7, 8, 9].map((n) => (
            <Button
              key={n}
              variant="outline"
              className="font-montserrat border-white/30 text-branco-nevoa h-14 text-lg"
              onClick={() => handleBaciasQuizChoice(n)}
            >
              {n}
            </Button>
          ))}
        </div>
        {baciasQuizAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className={`font-montserrat font-semibold ${correct ? 'text-green-400' : 'text-amber-300'}`}>
              {correct
                ? 'Correto! Goiás tem 3 grandes bacias (Paraná, Tocantins-Araguaia, São Francisco) e 8 subbacias (comitês de bacia).'
                : `São ${BACIA_COUNT} subbacias (comitês de bacia). Agora localize no mapa.`}
            </p>
            <Button
              className="mt-4 font-montserrat bg-white/15 text-branco-nevoa"
              onClick={goToMapAfterBaciasQuiz}
            >
              Continuar para o mapa
            </Button>
          </motion.div>
        )}
        <Button variant="ghost" onClick={onBack} className="font-lato text-branco-nevoa/80">
          Voltar ao menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1" style={{ minHeight: 0 }}>
      <div className="shrink-0 flex flex-col items-center gap-1">
        <p className="font-lato text-branco-nevoa font-medium text-center" style={{ fontSize: '18px' }}>
          {question}
        </p>
        {correctlySelectedCodareas.size > 0 && (
          <p className="font-montserrat text-green-400 font-semibold" style={{ fontSize: '16px' }}>
            {correctlySelectedCodareas.size} município(s) encontrado(s) — mapa colorido!
          </p>
        )}
      </div>

      <div
        className="flex-1 rounded-lg overflow-hidden border border-white/20"
        style={{ minHeight: '65vh', height: '65vh' }}
        role="application"
        aria-label="Mapa interativo de Goiás. Clique em um município para selecionar."
      >
        <MapContainer
          center={GOIAS_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ height: '100%', minHeight: '65vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GoiasMunicipalitiesLayer
            onMunicipalityClick={handleMunicipalityClick}
            highlightedCodareas={correctlySelectedCodareas}
          />
        </MapContainer>
      </div>

      <AnimatePresence mode="wait">
        {feedback === 'wrong' && (
          <motion.div
            className="flex flex-col gap-3 items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="font-montserrat font-semibold text-red-300" style={{ fontSize: '20px' }}>
              Errado. Tente outro município ou vá ao próximo desafio.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={nextChallenge}
                className="font-montserrat border-white/30 text-branco-nevoa"
              >
                Próximo desafio
              </Button>
              <Button
                onClick={onBack}
                className="font-montserrat bg-white/15 text-branco-nevoa hover:bg-white/25"
              >
                Voltar ao menu
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={nextChallenge}
          className="font-montserrat border-white/30 text-branco-nevoa"
        >
          Próximo desafio
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          className="font-lato text-branco-nevoa/80 hover:text-branco-nevoa"
        >
          Voltar ao menu
        </Button>
      </div>
    </div>
  );
}

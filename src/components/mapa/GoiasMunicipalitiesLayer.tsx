import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import type { PathOptions } from 'leaflet';
import type { Layer } from 'leaflet';
import { IBGE_GO_MUNICIPIOS_GEOJSON_URL } from '@/data/geography';

/** Cor de preenchimento dos municípios (azul água, semi-transparente) e borda. */
const defaultStyle: PathOptions = {
  color: 'rgba(42, 143, 173, 0.85)',
  weight: 1.2,
  fillColor: 'rgba(26, 107, 154, 0.25)',
  fillOpacity: 0.45,
  className: 'goias-municipality-layer',
};

/** Estilo de destaque no hover. */
const hoverStyle: PathOptions = {
  color: 'rgba(42, 143, 173, 1)',
  weight: 2.5,
  fillColor: 'rgba(133, 193, 212, 0.55)',
  fillOpacity: 0.75,
};

/** Estilo do município selecionado corretamente (mapa vai ficando colorido). */
const selectedStyle: PathOptions = {
  color: 'rgba(59, 109, 17, 0.95)',
  weight: 2,
  fillColor: 'rgba(59, 109, 17, 0.5)',
  fillOpacity: 0.75,
  className: 'goias-municipality-layer',
};

/** Retorna o código do município (IBGE codarea) para identificar o feature. */
export function getMunicipalityCode(feature: { properties?: Record<string, unknown> }): string {
  const cod = feature?.properties?.codarea ?? feature?.properties?.codigo ?? feature?.properties?.id ?? '';
  return String(cod);
}

/** Variação de tons por código do município para diferenciar visualmente. */
function styleByFeature(
  feature?: { properties?: Record<string, unknown> },
  highlightedCodareas?: Set<string>
): PathOptions {
  if (feature && highlightedCodareas?.size && highlightedCodareas.has(getMunicipalityCode(feature))) {
    return selectedStyle;
  }
  const cod = feature?.properties?.codarea ?? feature?.properties?.codigo ?? '';
  const n = String(cod).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = 195 + (n % 25);
  return {
    ...defaultStyle,
    fillColor: `hsla(${hue}, 45%, 38%, 0.35)`,
  };
}

/** Feature do GeoJSON (geometria + properties) para callback de clique. */
export interface MunicipalityFeature {
  type: 'Feature';
  geometry: { type: string; coordinates: unknown };
  properties?: Record<string, unknown>;
}

/** Cria bind de hover + clique; onMunicipalityClick recebe o feature clicado. */
function createBindHoverAndClick(
  onMunicipalityClick?: (feature: MunicipalityFeature) => void,
  highlightedCodareas?: Set<string>
) {
  return (feature: MunicipalityFeature, layer: Layer) => {
    const path = layer as unknown as { setStyle: (o: PathOptions) => void; bringToFront: () => void; bringToBack: () => void };
    const getCurrentStyle = () => styleByFeature(feature, highlightedCodareas);
    if (path.setStyle) {
      layer.on('mouseover', () => {
        path.setStyle(highlightedCodareas?.has(getMunicipalityCode(feature)) ? selectedStyle : hoverStyle);
        path.bringToFront?.();
      });
      layer.on('mouseout', () => {
        path.setStyle(getCurrentStyle());
        path.bringToBack?.();
      });
    }
    if (onMunicipalityClick) {
      layer.on('click', () => onMunicipalityClick(feature));
    }
  };
}

/**
 * Camada de limites municipais de Goiás via API do IBGE.
 * Fonte: https://servicodados.ibge.gov.br/api/v2/malhas/52
 */
interface GoiasMunicipalitiesLayerProps {
  onMunicipalityClick?: (feature: MunicipalityFeature) => void;
  /** Códigos dos municípios selecionados corretamente (ficam pintados no mapa). */
  highlightedCodareas?: Set<string>;
}

export default function GoiasMunicipalitiesLayer({ onMunicipalityClick, highlightedCodareas }: GoiasMunicipalitiesLayerProps) {
  const [data, setData] = useState<GeoJsonObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(IBGE_GO_MUNICIPIOS_GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`IBGE: ${res.status}`);
        return res.json();
      })
      .then((geojson: GeoJsonObject) => {
        if (!cancelled) setData(geojson);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null;
  if (!data) return null;

  const styleFn = (feature?: { properties?: Record<string, unknown> }) =>
    styleByFeature(feature, highlightedCodareas);

  return (
    <GeoJSON
      data={data}
      style={styleFn}
      onEachFeature={createBindHoverAndClick(onMunicipalityClick, highlightedCodareas)}
      key={`goias-municipios-${highlightedCodareas?.size ?? 0}`}
    />
  );
}

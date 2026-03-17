/**
 * Dados geográficos estáticos para o minigame do mapa (Goiás).
 *
 * Fontes:
 * - 3 grandes bacias: definição usual (ex.: Curta Mais, ANA — regiões hidrográficas que banham Goiás).
 * - 8 subbacias: comitês de bacia / unidades de planejamento em Goiás (SEMAD/ANA, Decretos e Resoluções CERHi).
 * - Limites municipais: IBGE, API de malhas (servicodados.ibge.gov.br/api/v2/malhas/52).
 * - Bacias hidrográficas (polígonos para colorir no mapa): ANA/SNIRH — dadosabertos.ana.gov.br
 *   ou snirh.gov.br (MapServer/Shapefile); não há API REST simples como a do IBGE.
 */

export type MapThemeId = 'bacias' | 'cidades-agua' | 'rios' | 'nascentes' | 'lista-agua';

export interface PointItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Pontos adicionais (ex.: rio/bacia atravessam vários municípios). Cada [lat, lng]. */
  points?: [number, number][];
}

export interface BaciaItem extends PointItem {
  /** Nome curto para exibição (ex.: "Paranaíba") */
  shortName?: string;
  /** Id da grande bacia à qual pertence (Tocantins-Araguaia, São Francisco, Paraná) */
  grandeBaciaId?: 'tocantins-araguaia' | 'sao-francisco' | 'parana';
}

/** Três grandes bacias hidrográficas que banham Goiás (ANA / definição em divulgação). */
export const GRANDES_BACIAS = [
  { id: 'tocantins-araguaia', name: 'Tocantins-Araguaia' },
  { id: 'sao-francisco', name: 'São Francisco' },
  { id: 'parana', name: 'Paraná' },
] as const;

/** Número de subbacias (comitês de bacia / unidades de planejamento) em Goiás. */
export const BACIA_COUNT = 8;

/** Subbacias (comitês de bacia): vários pontos para cobrir municípios por onde passam. */
export const BACIAS: BaciaItem[] = [
  { id: 'araguaia', name: 'Afluentes Goianos do Rio Araguaia', shortName: 'Araguaia', lat: -13.8, lng: -50.2, grandeBaciaId: 'tocantins-araguaia', points: [[-13.5, -50.5], [-14.0, -49.8]] },
  { id: 'corumba-sao-marcos', name: 'Rios Corumbá, Veríssimo e porção goiana do São Marcos', shortName: 'Corumbá / São Marcos', lat: -16.5, lng: -48.8, grandeBaciaId: 'parana', points: [[-16.2, -48.5], [-17.0, -49.0]] },
  { id: 'meia-ponte', name: 'Bacia do Rio Meia Ponte', shortName: 'Meia Ponte', lat: -16.9, lng: -49.3, grandeBaciaId: 'parana', points: [[-16.5, -49.5], [-17.2, -49.0]] },
  { id: 'turvo-bois', name: 'Rios Turvo e dos Bois', shortName: 'Turvo / Bois', lat: -17.2, lng: -49.7, grandeBaciaId: 'parana', points: [[-17.0, -49.5], [-17.5, -50.0]] },
  { id: 'paranaiba', name: 'Afluentes Goianos do Baixo Paranaíba', shortName: 'Paranaíba', lat: -18.0, lng: -48.5, grandeBaciaId: 'parana', points: [[-17.5, -48.2], [-18.2, -48.8]] },
  { id: 'almas-maranhao', name: 'Rio das Almas e Afluentes Goianos do Rio Maranhão', shortName: 'Almas / Maranhão', lat: -14.5, lng: -48.2, grandeBaciaId: 'tocantins-araguaia', points: [[-14.2, -48.0], [-14.8, -48.5]] },
  { id: 'tocantins', name: 'Afluentes Goianos do Médio Tocantins', shortName: 'Tocantins', lat: -13.2, lng: -48.5, grandeBaciaId: 'tocantins-araguaia', points: [[-13.5, -48.0], [-13.0, -49.0]] },
  { id: 'sao-francisco', name: 'Afluentes Goianos do São Francisco', shortName: 'São Francisco', lat: -14.8, lng: -46.2, grandeBaciaId: 'sao-francisco', points: [[-14.5, -46.5], [-15.0, -46.0]] },
];

/** Cidades de Goiás com referência a "água" no nome */
export const CIDADES_COM_AGUA: PointItem[] = [
  { id: 'aguas-lindas', name: 'Águas Lindas de Goiás', lat: -15.7617, lng: -48.2842 },
  { id: 'aguas-quentes', name: 'Águas Quentes', lat: -14.0833, lng: -46.6167 },
  { id: 'agua-fria', name: 'Água Fria de Goiás', lat: -14.9833, lng: -47.7833 },
];

/** Principais rios: vários pontos ao longo do trajeto para cobrir municípios que atravessam. */
export const RIOS_PRINCIPAIS: PointItem[] = [
  { id: 'paranaiba', name: 'Rio Paranaíba', lat: -18.5, lng: -48.2, points: [[-18.0, -48.5], [-17.8, -48.0]] },
  { id: 'araguaia', name: 'Rio Araguaia', lat: -13.5, lng: -50.5, points: [[-13.8, -50.2], [-14.0, -50.0]] },
  { id: 'tocantins', name: 'Rio Tocantins', lat: -13.2, lng: -48.5, points: [[-13.5, -48.0], [-13.0, -49.0]] },
  { id: 'corumba', name: 'Rio Corumbá', lat: -16.5, lng: -48.8, points: [[-16.2, -48.5], [-16.8, -49.0]] },
  { id: 'meia-ponte', name: 'Rio Meia Ponte', lat: -16.9, lng: -49.3, points: [[-16.5, -49.5], [-17.2, -49.0]] },
  { id: 'maranhao', name: 'Rio Maranhão', lat: -14.2, lng: -48.0, points: [[-14.0, -48.2], [-14.5, -47.8]] },
  { id: 'sao-marcos', name: 'Rio São Marcos', lat: -16.2, lng: -48.5, points: [[-16.0, -48.2], [-16.5, -48.8]] },
  { id: 'claro', name: 'Rio Claro', lat: -17.8, lng: -50.9, points: [[-17.5, -50.5], [-18.0, -51.0]] },
];

/** Municípios com destaque em nascentes / recursos hídricos (exemplos) */
export const MUNICIPIOS_NASCENTES: PointItem[] = [
  { id: 'alto-paraiso', name: 'Alto Paraíso de Goiás', lat: -14.1306, lng: -47.52 },
  { id: 'pirenopolis', name: 'Pirenópolis', lat: -15.8506, lng: -48.9583 },
  { id: 'caldas-novas', name: 'Caldas Novas', lat: -17.7442, lng: -48.6278 },
  { id: 'sao-domingos', name: 'São Domingos', lat: -13.3983, lng: -46.3189 },
  { id: 'mines', name: 'Minaçu', lat: -13.5306, lng: -48.2206 },
];

/** URL da API de malhas do IBGE: limites municipais de Goiás (estado 52). Fonte: servicodados.ibge.gov.br */
export const IBGE_GO_MUNICIPIOS_GEOJSON_URL =
  'https://servicodados.ibge.gov.br/api/v2/malhas/52?resolucao=5&formato=application/vnd.geo+json&qualidade=minima';

/** Lista dos 10 municípios de Goiás com nomes referentes a água (para o minigame de palavras). */
export const MUNICIPIOS_AGUA_LISTA: string[] = [
  'Águas Lindas de Goiás',
  'Água Fria de Goiás',
  'Águas Quentes',
  'Caldas Novas',
  'Rio Verde',
  'Pirenópolis',
  'São Domingos',
  'Alto Paraíso de Goiás',
  'Minaçu',
  'Cristalina',
];

/** Normaliza nome para comparação (minúsculas, sem acentos, trim). */
export function normalizarNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** Retorna o nome canônico da lista se o texto digitado corresponder a algum; senão null. */
export function buscarMunicipioAgua(digitado: string): string | null {
  const n = normalizarNome(digitado);
  if (!n) return null;
  return MUNICIPIOS_AGUA_LISTA.find((m) => normalizarNome(m) === n) ?? null;
}

export const MAP_THEMES: { id: MapThemeId; label: string; description: string }[] = [
  { id: 'bacias', label: 'Bacias hidrográficas', description: 'Quantas são e onde estão as bacias em Goiás' },
  { id: 'cidades-agua', label: 'Cidades com água no nome', description: 'Municípios com referência a água no nome' },
  { id: 'rios', label: 'Principais rios', description: 'Onde estão os principais rios do estado' },
  { id: 'nascentes', label: 'Municípios com nascentes', description: 'Cidades com destaque em nascentes' },
  { id: 'lista-agua', label: 'Lista: municípios com água', description: 'Quase forca: digite os 10 municípios com nome referente a água' },
];

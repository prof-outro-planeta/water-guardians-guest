/** Constantes do minigame "Recuperar a última gota" */

export const DURATION_SECONDS = 20;

/** Intervalo mínimo/máximo (ms) entre spawns de gotas */
export const DROP_SPAWN_INTERVAL_MS = { min: 400, max: 800 };

/** Velocidade de queda das gotas (px/s) */
export const DROP_FALL_SPEED_PX_S = 100;

/** Raio da gota em pixels (desenho no canvas) */
export const DROP_RADIUS_PX = 8;

/** Largura do galão em pixels (formato vertical) */
export const BUCKET_WIDTH_PX = 64;

/** Altura do galão em pixels */
export const BUCKET_HEIGHT_PX = 88;

/** Número de gotas capturadas necessárias para encher o galão (100%) */
export const DROPS_TO_FILL = 18;

/** Dimensões da área de jogo (canvas) em pixels */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 320;

/** Cores tema água (hex para canvas) */
export const COLORS = {
  drop: '#5BA3C6',
  dropHighlight: '#7EC8E3',
  gallon: '#2D7BA6',
  gallonStroke: '#3D9BC9',
  gallonWater: '#3B9ED4',
  gallonWaterHighlight: '#5BB8E8',
  fillBarBg: 'rgba(26, 107, 154, 0.3)',
  fillBarFill: '#3B9ED4',
} as const;

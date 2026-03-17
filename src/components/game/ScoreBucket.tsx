import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from './minigames/constants';

interface ScoreBucketProps {
  /** Fill level from 0 to 1 */
  fillLevel: number;
  /** Optional: show numeric score next to bucket */
  score?: number;
  /** When true, water animates from 0 to fillLevel on mount */
  animateFromZero?: boolean;
  /** Scale factor for display (e.g. 2.5 for transition screen) */
  scale?: number;
  className?: string;
}

const ScoreBucket = forwardRef<HTMLDivElement, ScoreBucketProps>(
  ({ fillLevel, score, animateFromZero = false, scale: scaleProp = 1, className = '' }, ref) => {
    const clipId = useId().replace(/:/g, '-');
    const gradientId = useId().replace(/:/g, '-');
    const clampedFill = Math.max(0, Math.min(1, fillLevel));

    const width = 48;
    const height = 64;
    const neckHeight = 8;
    const bodyTop = neckHeight;
    const bodyHeight = height - neckHeight;
    const radius = 6;
    const innerPad = 4;

    const fillableX = innerPad;
    const fillableY = bodyTop + innerPad;
    const fillableW = width - innerPad * 2;
    const fillableH = bodyHeight - innerPad * 2;

    const waterHeightPx = fillableH * clampedFill;
    const waterTopY = fillableY + fillableH - waterHeightPx;

    return (
      <div
        ref={ref}
        className={`flex items-center gap-2 shrink-0 ${className}`}
        style={scaleProp !== 1 ? { transform: `scale(${scaleProp})`, transformOrigin: 'center center' } : undefined}
        aria-label={score != null ? `Pontuação: ${score} pontos` : 'Balde de pontuação'}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="shrink-0"
          aria-hidden
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={fillableX} y={fillableY} width={fillableW} height={fillableH} rx={radius - 2} />
            </clipPath>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0" stopColor={COLORS.gallonWaterHighlight} />
              <stop offset="0.5" stopColor={COLORS.gallonWater} />
              <stop offset="1" stopColor={COLORS.gallonWater} />
            </linearGradient>
          </defs>

          {/* Body (bucket container) — mesma área que o clip */}
          <rect
            x={fillableX}
            y={fillableY}
            width={fillableW}
            height={fillableH}
            rx={radius - 2}
            fill="rgba(45, 123, 166, 0.15)"
            stroke={COLORS.gallonStroke}
            strokeWidth={2}
          />

          {/* Água: sobe de baixo para cima; sempre renderiza o rect para a animação de preenchimento funcionar */}
          <g clipPath={`url(#${clipId})`}>
            <motion.rect
              x={fillableX + 2}
              y={waterTopY}
              width={fillableW - 4}
              height={Math.max(0, waterHeightPx)}
              fill={`url(#${gradientId})`}
              initial={
                animateFromZero
                  ? { y: fillableY + fillableH, height: 0 }
                  : false
              }
              animate={{
                y: waterTopY,
                height: Math.max(0, waterHeightPx),
              }}
              transition={
                animateFromZero
                  ? { type: 'spring' as const, damping: 20, stiffness: 100 }
                  : { type: 'spring' as const, damping: 18, stiffness: 120 }
              }
            />
          </g>

          {/* Neck (top of gallon) */}
          <rect
            x={width * 0.25}
            y={0}
            width={width * 0.5}
            height={neckHeight}
            rx={4}
            fill={COLORS.gallon}
            stroke={COLORS.gallonStroke}
            strokeWidth={2}
          />
        </svg>
        {score != null && (
          <span
            className="font-montserrat font-bold text-amber-ipe tabular-nums"
            style={{ fontSize: '20px' }}
          >
            {score}
          </span>
        )}
      </div>
    );
  }
);

ScoreBucket.displayName = 'ScoreBucket';

export default ScoreBucket;

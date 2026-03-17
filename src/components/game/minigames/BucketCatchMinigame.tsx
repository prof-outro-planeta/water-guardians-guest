import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BUCKET_HEIGHT_PX,
  BUCKET_WIDTH_PX,
  COLORS,
  DROP_FALL_SPEED_PX_S,
  DROP_RADIUS_PX,
  DROP_SPAWN_INTERVAL_MS,
  DROPS_TO_FILL,
  DURATION_SECONDS,
  GAME_HEIGHT,
  GAME_WIDTH,
} from './constants';

export interface BucketCatchMinigameProps {
  durationSeconds?: number;
  onSuccess: () => void;
  onSkip: () => void;
  className?: string;
}

interface Drop {
  id: number;
  x: number;
  y: number;
}

type GameStatus = 'playing' | 'won' | 'lost';

function nextSpawnDelay(): number {
  const { min, max } = DROP_SPAWN_INTERVAL_MS;
  return min + Math.random() * (max - min);
}

export function BucketCatchMinigame({
  durationSeconds = DURATION_SECONDS,
  onSuccess,
  onSkip,
  className = '',
}: BucketCatchMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [dropsCaught, setDropsCaught] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [isDragging, setIsDragging] = useState(false);

  const gameRef = useRef<{
    drops: Drop[];
    bucketX: number;
    dropId: number;
    lastTime: number;
    spawnAt: number;
    startTime: number;
  }>({
    drops: [],
    bucketX: (GAME_WIDTH - BUCKET_WIDTH_PX) / 2,
    dropId: 0,
    lastTime: 0,
    spawnAt: 0,
    startTime: 0,
  });

  const bucketTop = GAME_HEIGHT - BUCKET_HEIGHT_PX;
  const dragOffsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCalledSuccessRef = useRef(false);
  const fillLevelRef = useRef(0);

  const handleSkip = useCallback(() => {
    setStatus('lost');
    onSkip();
  }, [onSkip]);

  // Game loop: spawn, update drops, collision, draw
  const tick = useCallback(
    (now: number) => {
      const g = gameRef.current;
      const canvas = canvasRef.current;
      if (!canvas || status !== 'playing') return;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = (now - g.lastTime) / 1000;
      g.lastTime = now;

      // Spawn drops
      if (now >= g.spawnAt) {
        g.drops.push({
          id: ++g.dropId,
          x: DROP_RADIUS_PX + Math.random() * (GAME_WIDTH - 2 * DROP_RADIUS_PX),
          y: -DROP_RADIUS_PX,
        });
        g.spawnAt = now + nextSpawnDelay();
      }

      // Update drop positions and collision
      const toRemove: number[] = [];
      g.drops.forEach((drop, i) => {
        drop.y += DROP_FALL_SPEED_PX_S * dt;
        if (drop.y - DROP_RADIUS_PX > GAME_HEIGHT) {
          toRemove.push(i);
          return;
        }
        const inBucketX = drop.x >= g.bucketX && drop.x <= g.bucketX + BUCKET_WIDTH_PX;
        const inBucketY = drop.y + DROP_RADIUS_PX >= bucketTop && drop.y - DROP_RADIUS_PX <= bucketTop + BUCKET_HEIGHT_PX;
        if (inBucketX && inBucketY) {
          toRemove.push(i);
          setDropsCaught((c) => {
            const next = c + 1;
            if (next >= DROPS_TO_FILL && !hasCalledSuccessRef.current) {
              hasCalledSuccessRef.current = true;
              setStatus('won');
              onSuccess();
            }
            return next;
          });
        }
      });
      toRemove.reverse().forEach((i) => g.drops.splice(i, 1));

      // Draw
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      g.drops.forEach((drop) => {
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, DROP_RADIUS_PX, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.drop;
        ctx.fill();
        ctx.strokeStyle = COLORS.dropHighlight;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const bx = g.bucketX;
      const by = bucketTop;
      const w = BUCKET_WIDTH_PX;
      const h = BUCKET_HEIGHT_PX;
      const radius = 8;
      const neckHeight = 10;
      const bodyTop = by + neckHeight;

      // Galão: corpo (rounded rect vertical) + pescoço/tampa no topo
      ctx.save();

      // Corpo do galão (onde a água enche)
      ctx.beginPath();
      ctx.roundRect(bx, bodyTop, w, h - neckHeight, radius);
      ctx.clip();

      // Água que sobe dentro do galão (preenche de baixo para cima)
      const fillRatio = Math.min(1, fillLevelRef.current);
      const innerW = w - 6;
      const innerH = h - neckHeight - 6;
      const waterHeight = innerH * fillRatio;
      if (waterHeight > 0) {
        const waterY = by + h - neckHeight - 6 - waterHeight;
        const gradient = ctx.createLinearGradient(bx, waterY, bx + w, waterY + waterHeight);
        gradient.addColorStop(0, COLORS.gallonWaterHighlight);
        gradient.addColorStop(0.5, COLORS.gallonWater);
        gradient.addColorStop(1, COLORS.gallonWater);
        ctx.fillStyle = gradient;
        ctx.fillRect(bx + 3, waterY, innerW, waterHeight);
      }

      ctx.restore();

      // Contorno do galão (corpo)
      ctx.strokeStyle = COLORS.gallonStroke;
      ctx.fillStyle = 'rgba(45, 123, 166, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx, bodyTop, w, h - neckHeight, radius);
      ctx.fill();
      ctx.stroke();

      // Tampa/pescoço do galão (retângulo menor no topo)
      const neckW = w * 0.5;
      const neckX = bx + (w - neckW) / 2;
      ctx.fillStyle = COLORS.gallon;
      ctx.strokeStyle = COLORS.gallonStroke;
      ctx.beginPath();
      ctx.roundRect(neckX, by, neckW, neckHeight, 4);
      ctx.fill();
      ctx.stroke();

      rafRef.current = requestAnimationFrame(tick);
    },
    [bucketTop, status, onSuccess]
  );

  // Start game loop and timer
  useEffect(() => {
    if (status !== 'playing') return;
    const start = performance.now();
    gameRef.current.lastTime = start;
    gameRef.current.startTime = start;
    gameRef.current.spawnAt = start + nextSpawnDelay();

    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus((s) => {
            if (s === 'playing') onSkip();
            return 'lost';
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, [status, tick, onSkip]);

  useEffect(() => {
    fillLevelRef.current = dropsCaught / DROPS_TO_FILL;
  }, [dropsCaught]);

  // Pointer events for gallon drag (canvas coords)
  const getCanvasCoords = useCallback((e: React.PointerEvent | PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (status !== 'playing') return;
      const { x, y } = getCanvasCoords(e);
      const g = gameRef.current;
      const inBucketX = x >= g.bucketX && x <= g.bucketX + BUCKET_WIDTH_PX;
      const inBucketY = y >= bucketTop && y <= bucketTop + BUCKET_HEIGHT_PX;
      if (inBucketX && inBucketY) {
        setIsDragging(true);
        dragOffsetRef.current = x - g.bucketX;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
    },
    [status, getCanvasCoords, bucketTop]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || status !== 'playing') return;
      const { x } = getCanvasCoords(e);
      const g = gameRef.current;
      let nx = x - dragOffsetRef.current;
      nx = Math.max(0, Math.min(GAME_WIDTH - BUCKET_WIDTH_PX, nx));
      g.bucketX = nx;
    },
    [isDragging, status, getCanvasCoords]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }
    },
    [isDragging]
  );

  const fillPercent = Math.min(100, (dropsCaught / DROPS_TO_FILL) * 100);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <p className="font-lato text-branco-nevoa/95 text-center text-sm max-w-md">
        Arraste o galão para capturar as gotas. Você tem {durationSeconds} segundos para enchê-lo e recuperar a última gota.
      </p>

      <div className="flex items-center justify-between w-full max-w-md">
        <span className="font-montserrat font-semibold text-branco-nevoa tabular-nums">
          {timeLeft}s
        </span>
        <div className="flex-1 mx-4 h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${fillPercent}%`,
              backgroundColor: COLORS.fillBarFill,
            }}
          />
        </div>
        <span className="font-montserrat text-branco-nevoa/80 text-sm">
          {dropsCaught}/{DROPS_TO_FILL}
        </span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="block w-full max-w-md rounded-lg border border-white/20 bg-[hsl(var(--azul-profundo))] cursor-grab active:cursor-grabbing touch-none"
          style={{ maxHeight: 'min(60vh, 320px)', objectFit: 'contain' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Área do jogo: gotas caindo e galão para arrastar"
        />
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="font-lato font-semibold text-branco-nevoa/90 hover:text-branco-nevoa px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
      >
        Desistir
      </button>
    </div>
  );
}

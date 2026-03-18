import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    // Safari
    (document as any).webkitFullscreenElement ??
    // Old MS
    (document as any).msFullscreenElement ??
    null
  );
}

function canFullscreen(): boolean {
  const el: any = document.documentElement;
  return Boolean(
    document.exitFullscreen ||
      (document as any).webkitExitFullscreen ||
      (document as any).msExitFullscreen ||
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen,
  );
}

async function enterFullscreen(): Promise<void> {
  const el: any = document.documentElement;
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
}

async function exitFullscreen(): Promise<void> {
  const doc: any = document;
  if (document.exitFullscreen) return document.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
}

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(() => Boolean(getFullscreenElement()));
  const supported = React.useMemo(() => canFullscreen(), []);

  React.useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(getFullscreenElement()));
    document.addEventListener("fullscreenchange", onChange);
    // Safari
    document.addEventListener("webkitfullscreenchange" as any, onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange" as any, onChange);
    };
  }, []);

  const label = supported
    ? isFullscreen
      ? "Sair da tela cheia"
      : "Entrar em tela cheia"
    : "Tela cheia indisponível neste navegador";

  const onToggle = async () => {
    if (!supported) return;
    try {
      if (getFullscreenElement()) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch {
      // Alguns navegadores bloqueiam fullscreen fora de gesto do usuário.
      // Mantemos silencioso para não atrapalhar o jogo.
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onToggle}
            disabled={!supported}
            aria-label={label}
            className="shadow-lg"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    </div>
  );
}


import { useEffect, useRef, type RefObject } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { useClimateStore } from "@/hooks/useClimateStore";
import { CLIMATE_DATA } from "@/lib/climateData";

type Particle = {
  lng: number;
  lat: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

export default function AnimatedParticles({
  mapRef,
}: {
  mapRef: RefObject<MLMap | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const { activeVariable } = useClimateStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    const map = mapRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Wind particles seeded across India
    const windParticles: Particle[] = Array.from({ length: 220 }, () =>
      spawnWindParticle(),
    );
    // Rain particles only for high-rainfall states
    const rainStates = CLIMATE_DATA.filter((s) => s.current.rainfall > 1800);
    const rainParticles: Array<{ x: number; y: number; len: number; speed: number }> = [];

    function spawnWindParticle(): Particle {
      return {
        lng: 68 + Math.random() * 30,
        lat: 8 + Math.random() * 28,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 40 + Math.random() * 60,
      };
    }

    function loop() {
      const rect = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);

      // ---- wind ----
      ctx!.strokeStyle = "rgba(255,255,255,0.35)";
      ctx!.lineWidth = 1.2;
      for (const p of windParticles) {
        // basic wind field: westerlies + monsoon swirl
        const u = Math.cos((p.lat / 28) * Math.PI) * 0.06 + 0.02;
        const v = Math.sin((p.lng / 30) * Math.PI) * 0.04 - 0.01;
        const prev = map!.project([p.lng, p.lat]);
        p.lng += u;
        p.lat += v;
        p.life++;
        const curr = map!.project([p.lng, p.lat]);
        ctx!.beginPath();
        ctx!.moveTo(prev.x, prev.y);
        ctx!.lineTo(curr.x, curr.y);
        ctx!.stroke();
        if (p.life > p.maxLife || p.lng > 98 || p.lat > 38 || p.lng < 65 || p.lat < 6) {
          Object.assign(p, spawnWindParticle());
        }
      }

      // ---- rain (only if rainfall layer) ----
      if (activeVariable === "rainfall") {
        // Maintain rain particles over rain states
        if (rainParticles.length < 240) {
          for (const s of rainStates) {
            const pt = map!.project([
              s.coordinates.lng + (Math.random() - 0.5) * 1.4,
              s.coordinates.lat + (Math.random() - 0.5) * 1.4,
            ]);
            rainParticles.push({
              x: pt.x,
              y: pt.y - 40 - Math.random() * 60,
              len: 5 + Math.random() * 6,
              speed: 4 + Math.random() * 3,
            });
            if (rainParticles.length >= 240) break;
          }
        }
        ctx!.strokeStyle = "rgba(136,187,255,0.55)";
        ctx!.lineWidth = 1;
        for (const r of rainParticles) {
          ctx!.beginPath();
          ctx!.moveTo(r.x, r.y);
          ctx!.lineTo(r.x - 1, r.y + r.len);
          ctx!.stroke();
          r.y += r.speed;
          if (r.y > rect.height) {
            r.y = -10;
            r.x = Math.random() * rect.width;
          }
        }
      } else {
        rainParticles.length = 0;
      }

      rafRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [mapRef, activeVariable]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

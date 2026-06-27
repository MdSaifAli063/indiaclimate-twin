import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  label: string;
  value: number;
  decimals?: number;
  unit: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: ReactNode;
  accent: string;
};

export default function StatCard({ label, value, decimals = 1, unit, delta, trend, icon, accent }: Props) {
  const [shown, setShown] = useState(value);
  const startRef = useRef(value);
  useEffect(() => {
    const start = shown;
    const end = value;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 500);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    startRef.current = end;
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="glass-card relative overflow-hidden p-4">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.18 }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className="font-mono text-3xl font-bold tabular-nums"
              style={{ color: accent }}
            >
              {shown.toFixed(decimals)}
            </span>
            <span className="text-xs text-twin-muted">{unit}</span>
          </div>
          {delta && (
            <div className="mt-1 flex items-center gap-1 font-mono text-[10px]">
              <span
                className={
                  trend === "up"
                    ? "text-twin-red"
                    : trend === "down"
                      ? "text-twin-teal"
                      : "text-twin-muted"
                }
              >
                {trend === "up" ? "\u25B2" : trend === "down" ? "\u25BC" : "\u2014"} {delta}
              </span>
              <span className="text-twin-muted">vs baseline</span>
            </div>
          )}
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg ring-1"
          style={{ background: `${accent}1f`, borderColor: accent, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

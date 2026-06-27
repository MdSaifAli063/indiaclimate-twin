import { useMemo, useState } from "react";
import { AlertTriangle, Waves, Sun, Thermometer, CloudFog, Mountain, Wind } from "lucide-react";
import { CLIMATE_DATA } from "@/lib/climateData";
import { generateExtremeEvents } from "@/lib/aiInsights";

const ICONS: Record<string, typeof AlertTriangle> = {
  cyclone: Wind,
  flood: Waves,
  drought: Sun,
  heatwave: Thermometer,
  "glacier-retreat": Mountain,
  fog: CloudFog,
};

const SEV_RING: Record<string, string> = {
  extreme: "border-twin-red/50 bg-twin-red/10",
  severe: "border-twin-red/50 bg-twin-red/10",
  warning: "border-twin-orange/50 bg-twin-orange/10",
  watch: "border-twin-amber/40 bg-twin-amber/5",
};
const SEV_DOT: Record<string, string> = {
  extreme: "bg-twin-red",
  severe: "bg-twin-red",
  warning: "bg-twin-orange",
  watch: "bg-twin-amber",
};

const SOURCES = ["IMD", "INCOIS", "CWC", "CPCB", "GRACE-FO"];

export default function ExtremesPanel() {
  const [filter, setFilter] = useState<string>("ALL");
  const events = useMemo(() => {
    const all = CLIMATE_DATA.flatMap((s) =>
      generateExtremeEvents(s).map((e) => ({ ...e, stateName: s.name })),
    );
    return all
      .sort((a, b) => b.probability - a.probability)
      .filter((e) => filter === "ALL" || e.source === filter)
      .slice(0, 8);
  }, [filter]);

  return (
    <div className="glass-card flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-twin-text">Extreme events & alerts</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
            Auto-generated from live state data
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">
            {events.length} active
          </span>
          <span className="relative ml-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-twin-red opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-twin-red" />
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {["ALL", ...SOURCES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest transition ${
              filter === s
                ? "border-twin-cyan/60 bg-twin-cyan/15 text-twin-cyan"
                : "border-twin-border text-twin-muted hover:text-twin-text"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {events.map((e) => {
          const Icon = ICONS[e.type] ?? AlertTriangle;
          return (
            <div
              key={e.id}
              className={`rounded-lg border p-3 ${SEV_RING[e.severity]}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-twin-dark/60">
                  <Icon className="h-4 w-4 text-twin-text" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[13px] font-semibold text-twin-text">{e.title}</div>
                    <span className={`h-1.5 w-1.5 rounded-full ${SEV_DOT[e.severity]}`} />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-twin-muted">
                    {e.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 overflow-hidden rounded-full bg-twin-border">
                        <div
                          className="h-full bg-twin-cyan"
                          style={{ width: `${e.probability}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-twin-cyan">
                        {e.probability}%
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">
                      {e.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

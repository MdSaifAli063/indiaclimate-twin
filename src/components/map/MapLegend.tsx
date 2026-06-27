import { useClimateStore } from "@/hooks/useClimateStore";
import { scaleStops, VARIABLE_META } from "@/lib/computeClimate";

export default function MapLegend() {
  const v = useClimateStore((s) => s.activeVariable);
  const stops = scaleStops(v);
  const meta = VARIABLE_META[v];
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 z-10 w-[150px] rounded-lg border border-twin-border bg-twin-dark/75 p-2.5 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">
          {meta.label}
        </span>
        <span className="font-mono text-[9px] text-twin-muted">{meta.unit}</span>
      </div>
      <div
        className="h-2 w-full rounded"
        style={{
          background: `linear-gradient(to right, ${stops.map((s) => s.color).join(",")})`,
        }}
      />
      <div className="mt-1 flex justify-between font-mono text-[9px] text-twin-muted">
        <span>{stops[0].label}</span>
        <span>{stops[stops.length - 1].label}</span>
      </div>
    </div>
  );
}

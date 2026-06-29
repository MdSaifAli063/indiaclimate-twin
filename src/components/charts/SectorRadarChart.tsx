import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { StateClimateData } from "@/lib/climateData";

function score(level: "low" | "medium" | "high" | "extreme"): number {
  return level === "low" ? 25 : level === "medium" ? 50 : level === "high" ? 75 : 95;
}

export default function SectorRadarChart({ state }: { state: StateClimateData }) {
  const today = {
    Agriculture: score(state.sectors.agriculture.droughtRisk),
    Water: Math.min(100, 100 - state.sectors.water.reservoirLevel + 30),
    "Urban Heat": Math.min(100, state.sectors.urban.heatIslandIntensity * 22),
    Health: state.sectors.health.heatStressIndex,
    Energy: Math.min(100, state.sectors.energy.coolingDemandIncrease),
    Biodiversity: 100 - state.sectors.urban.greenCoverPercent,
  };
  const future = Object.fromEntries(
    Object.entries(today).map(([k, v]) => [k, Math.min(100, Math.round(v * 1.35))]),
  );
  const data = Object.keys(today).map((k) => ({
    axis: k,
    today: today[k as keyof typeof today],
    future: future[k] as number,
  }));

  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="mb-2">
        <div className="text-sm font-semibold text-twin-text">Sector vulnerability</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
          {state.name} · today vs 2050
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
            <PolarGrid stroke="#1c2a40" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "#7a9bb5", fontFamily: "Space Mono" }} />
            <PolarRadiusAxis tick={false} axisLine={false} stroke="#1c2a40" />
            <Radar name="Today" dataKey="today" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.32} />
            <Radar name="2050" dataKey="future" stroke="#ff4d2e" fill="#ff4d2e" fillOpacity={0.22} />
            <Tooltip
              contentStyle={{
                background: "#071a2e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontFamily: "Space Mono",
                fontSize: 11,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: "Space Mono", color: "#7a9bb5" }}
              iconSize={8}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

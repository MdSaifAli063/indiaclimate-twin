import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { StateClimateData } from "@/lib/climateData";
import { SCENARIO_META, type Scenario, interpolateProjection } from "@/lib/computeClimate";

export default function ProjectionTimelineChart({
  state,
  active,
}: {
  state: StateClimateData;
  active: Scenario;
}) {
  const years = [2024, 2030, 2040, 2050, 2075, 2100];
  const data = years.map((y) => {
    const p = interpolateProjection(state, y);
    return {
      year: y,
      rcp26: +(p.tempDelta * SCENARIO_META.rcp26.multiplier).toFixed(2),
      rcp45: +(p.tempDelta * SCENARIO_META.rcp45.multiplier).toFixed(2),
      rcp60: +(p.tempDelta * SCENARIO_META.rcp60.multiplier).toFixed(2),
      rcp85: +(p.tempDelta * SCENARIO_META.rcp85.multiplier).toFixed(2),
    };
  });
  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="mb-2">
        <div className="text-sm font-semibold text-twin-text">Temperature projection</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
          {state.name} \u00b7 \u0394\u00b0C from baseline \u00b7 2024\u20132100
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2a40" vertical={false} />
            <XAxis dataKey="year" stroke="#7a9bb5" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
            <YAxis stroke="#7a9bb5" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
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
            {(["rcp26", "rcp45", "rcp60", "rcp85"] as Scenario[]).map((s) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                name={SCENARIO_META[s].label}
                stroke={SCENARIO_META[s].color}
                strokeWidth={active === s ? 3 : 1.4}
                strokeOpacity={active === s ? 1 : 0.55}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

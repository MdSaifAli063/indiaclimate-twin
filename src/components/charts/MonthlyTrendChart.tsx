import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { StateClimateData } from "@/lib/climateData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthlyTrendChart({ state }: { state: StateClimateData }) {
  const data = MONTHS.map((m, i) => ({
    month: m,
    rainfall: state.monthly.rainfall[i],
    temperature: state.monthly.temperature[i],
  }));
  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-twin-text">Monthly climate profile</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
            {state.name} · 12-month
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="flex items-center gap-1.5 text-twin-blue">
            <span className="h-2 w-2 rounded-sm bg-twin-blue" /> Rainfall
          </span>
          <span className="flex items-center gap-1.5 text-twin-orange">
            <span className="h-0.5 w-3 bg-twin-orange" /> Temp
          </span>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 10, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2a40" vertical={false} />
            <XAxis dataKey="month" stroke="#7a9bb5" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
            <YAxis yAxisId="rain" stroke="#0ea5e9" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
            <YAxis yAxisId="temp" orientation="right" stroke="#ff8c42" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
            <Tooltip
              contentStyle={{
                background: "#071a2e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontFamily: "Space Mono",
                fontSize: 11,
              }}
              labelStyle={{ color: "#e2f0ff" }}
            />
            <Bar yAxisId="rain" dataKey="rainfall" fill="#0ea5e9" radius={[3, 3, 0, 0]} opacity={0.7} />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke="#ff8c42"
              strokeWidth={2.4}
              dot={{ fill: "#ff8c42", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

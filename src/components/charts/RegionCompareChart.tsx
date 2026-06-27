import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { CLIMATE_DATA, REGIONS, type Region } from "@/lib/climateData";

export default function RegionCompareChart() {
  const groups: Region[] = ["north", "south", "east", "west", "northeast", "central", "ut"];
  const data = groups.map((r) => {
    const states = CLIMATE_DATA.filter((s) => s.region === r);
    const avg = (k: (s: (typeof states)[number]) => number) =>
      +(states.reduce((a, s) => a + k(s), 0) / Math.max(1, states.length)).toFixed(1);
    return {
      region: REGIONS[r],
      temperature: avg((s) => s.current.temperature),
      rainfallScaled: avg((s) => s.current.rainfall / 100),
      humidity: avg((s) => s.current.humidity),
      aqi: avg((s) => s.current.aqi / 2),
    };
  });
  return (
    <div className="glass-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-twin-text">Cross-region climate comparison</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
            Mean values across {CLIMATE_DATA.length} states & UTs
          </div>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2a40" vertical={false} />
            <XAxis dataKey="region" stroke="#7a9bb5" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
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
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Space Mono" }} iconSize={8} />
            <Bar dataKey="temperature" name="Temp \u00b0C" fill="#ff8c42" radius={[3, 3, 0, 0]} />
            <Bar dataKey="rainfallScaled" name="Rain (mm/100)" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
            <Bar dataKey="humidity" name="RH %" fill="#00d4aa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="aqi" name="AQI/2" fill="#a78bfa" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

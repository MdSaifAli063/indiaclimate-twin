import { useClimateStore } from "@/hooks/useClimateStore";
import { SCENARIO_META, type Scenario } from "@/lib/computeClimate";
import { getStateById } from "@/lib/climateData";
import { interpolateProjection } from "@/lib/computeClimate";
import { Sliders } from "lucide-react";

const POLICIES: Array<{ key: keyof ReturnType<typeof useClimateStore.getState>["simPolicies"]; label: string }> = [
  { key: "renewable", label: "Renewable energy transition" },
  { key: "forest", label: "Forest cover restoration" },
  { key: "urbanGreen", label: "Urban green infrastructure" },
  { key: "agriculture", label: "Agricultural modernization" },
  { key: "industrial", label: "Industrial emission controls" },
  { key: "water", label: "Water conservation adoption" },
];

export default function ScenarioSimulator() {
  const { scenario, setScenario, simPolicies, setPolicy, targetYear, setYear, selectedStateId } =
    useClimateStore();
  const state = selectedStateId ? getStateById(selectedStateId) : null;

  const avgPolicy = Object.values(simPolicies).reduce((a, b) => a + b, 0) / 6;
  const policyMitigation = avgPolicy / 100; // 0..1

  const baseProj = state
    ? interpolateProjection(state, targetYear)
    : { tempDelta: 2.4, rainfallDelta: -8, extremeEvents: 4 };
  const mult = SCENARIO_META[scenario].multiplier * (1 - policyMitigation * 0.55);
  const tempChange = +(baseProj.tempDelta * mult).toFixed(2);
  const rainChange = +(baseProj.rainfallDelta * mult).toFixed(1);
  const extremes = +(baseProj.extremeEvents * mult).toFixed(1);
  const gdpRisk = +(tempChange * 1.8 + Math.abs(rainChange) * 0.12).toFixed(1);

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-twin-cyan/10 ring-1 ring-twin-cyan/40">
            <Sliders className="h-4 w-4 text-twin-cyan" />
          </div>
          <div>
            <div className="text-sm font-semibold text-twin-text">Climate scenario simulator</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Model India\u2019s climate future under different emission pathways
            </div>
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
          {state ? state.name : "All India"} \u00b7 target {targetYear}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Emission scenario
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SCENARIO_META) as Scenario[]).map((s) => {
                const m = SCENARIO_META[s];
                const active = scenario === s;
                return (
                  <button
                    key={s}
                    onClick={() => setScenario(s)}
                    className={`group rounded-lg border p-2.5 text-left transition ${
                      active
                        ? "border-twin-cyan/60 bg-twin-cyan/5"
                        : "border-twin-border hover:border-twin-muted/40"
                    }`}
                    style={active ? { boxShadow: `inset 0 0 0 1px ${m.color}55` } : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: m.color }}
                      >
                        {m.label}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${active ? "" : "opacity-40"}`}
                        style={{ background: m.color }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] font-medium text-twin-text">{m.full}</div>
                    <div className="font-mono text-[9px] text-twin-muted">{m.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Policy interventions
            </div>
            <div className="space-y-3">
              {POLICIES.map((p) => (
                <div key={p.key}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-twin-text">{p.label}</span>
                    <span className="font-mono text-twin-cyan">{simPolicies[p.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simPolicies[p.key]}
                    onChange={(e) => setPolicy(p.key, +e.target.value)}
                    className="w-full accent-twin-cyan"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              <span>Year target</span>
              <span className="text-twin-cyan">{targetYear}</span>
            </div>
            <input
              type="range"
              min={2024}
              max={2100}
              step={1}
              value={targetYear}
              onChange={(e) => setYear(+e.target.value)}
              className="w-full accent-twin-cyan"
            />
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <OutCard label="Temperature change" value={`${tempChange >= 0 ? "+" : ""}${tempChange}\u00b0C`} color="#ff4d2e" />
            <OutCard label="Rainfall change" value={`${rainChange >= 0 ? "+" : ""}${rainChange}%`} color="#0ea5e9" />
            <OutCard label="Extreme events / yr" value={`+${extremes}`} color="#fbbf24" />
            <OutCard label="GDP climate risk" value={`-${gdpRisk}%`} color="#ff4d2e" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            <MiniSectorCard title="Agriculture" body={`Yield ${(tempChange * -4).toFixed(0)}%, irrigation +${(tempChange * 10).toFixed(0)}%`} />
            <MiniSectorCard title="Water" body={`${(tempChange * 14).toFixed(0)} BCM deficit by ${targetYear}`} />
            <MiniSectorCard title="Health" body={`${(tempChange * 8.4).toFixed(0)}M additional heat-stress cases`} />
          </div>
          <div className="rounded-lg border border-twin-border bg-twin-dark/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Mitigation effectiveness
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-twin-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-twin-teal via-twin-cyan to-twin-blue transition-all"
                style={{ width: `${avgPolicy.toFixed(0)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-twin-muted">
              <span>No action</span>
              <span className="text-twin-cyan">{avgPolicy.toFixed(0)}% policy stack</span>
              <span>Full intervention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-twin-border bg-twin-dark/40 p-3">
      <div
        className="absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl"
        style={{ background: color, opacity: 0.2 }}
      />
      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
          {label}
        </div>
        <div
          className="mt-1 font-mono text-2xl font-bold"
          style={{ color }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniSectorCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-twin-border bg-twin-dark/40 p-2.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-twin-cyan">{title}</div>
      <div className="mt-1 text-[11px] leading-snug text-twin-text">{body}</div>
    </div>
  );
}

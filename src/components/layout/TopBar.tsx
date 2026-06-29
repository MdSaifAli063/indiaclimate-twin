import { Bell, Download, ChevronDown } from "lucide-react";
import { useClimateStore } from "@/hooks/useClimateStore";
import { CLIMATE_DATA } from "@/lib/climateData";
import { SCENARIO_META, VARIABLE_META, type Scenario, type VariableType } from "@/lib/computeClimate";
import { Link } from "@tanstack/react-router";

export default function TopBar() {
  const { selectedStateId, setSelectedState, activeVariable, setVariable, scenario, setScenario, targetYear, setYear } =
    useClimateStore();

  return (
    <div className="sticky top-0 z-30 border-b border-twin-border bg-twin-dark/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-twin-cyan/15 ring-1 ring-twin-cyan/50">
            <div className="h-2 w-2 animate-pulse rounded-full bg-twin-cyan" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-twin-text">
              ClimateTwin <span className="text-twin-cyan">India</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">
              Digital twin · v1.4.2
            </div>
          </div>
        </Link>

        <div className="ml-2 hidden h-6 w-px bg-twin-border md:block" />

        <Select
          label="State"
          value={selectedStateId ?? ""}
          onChange={(v) => setSelectedState(v || null)}
          options={[{ value: "", label: "All India" }, ...CLIMATE_DATA.map((s) => ({ value: s.id, label: s.name }))]}
        />
        <Select
          label="Variable"
          value={activeVariable}
          onChange={(v) => setVariable(v as VariableType)}
          options={(Object.keys(VARIABLE_META) as VariableType[]).map((v) => ({
            value: v,
            label: VARIABLE_META[v].label,
          }))}
        />

        <div className="flex items-center gap-1 rounded-md border border-twin-border bg-twin-dark/40 p-0.5">
          {(Object.keys(SCENARIO_META) as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`rounded px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide transition ${
                scenario === s ? "text-twin-dark" : "text-twin-muted hover:text-twin-text"
              }`}
              style={
                scenario === s
                  ? { background: SCENARIO_META[s].color }
                  : undefined
              }
            >
              {SCENARIO_META[s].label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Horizon
            </span>
            <input
              type="range"
              min={2024}
              max={2100}
              value={targetYear}
              onChange={(e) => setYear(+e.target.value)}
              className="w-40 accent-twin-cyan"
            />
            <span className="w-12 font-mono text-sm font-bold text-twin-cyan">{targetYear}</span>
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-twin-border bg-twin-dark/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-twin-text transition hover:border-twin-cyan/40 hover:text-twin-cyan">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button className="relative flex h-8 w-8 items-center justify-center rounded-md border border-twin-border bg-twin-dark/40 text-twin-text transition hover:border-twin-red/40 hover:text-twin-red">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-twin-red px-0.5 font-mono text-[8px] font-bold text-white">
              7
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="group relative flex h-8 items-center gap-2 rounded-md border border-twin-border bg-twin-dark/40 px-2.5 pr-7 transition hover:border-twin-cyan/40">
      <span className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent text-[12px] font-medium text-twin-text outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-twin-mid">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-twin-muted" />
    </label>
  );
}

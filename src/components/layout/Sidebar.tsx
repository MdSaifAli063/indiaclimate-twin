import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe2,
  Thermometer,
  CloudRain,
  AlertTriangle,
  Sliders,
  LayoutGrid,
  Database,
  FileBarChart,
  Settings2,
  Satellite,
} from "lucide-react";
import { useClimateStore } from "@/hooks/useClimateStore";
import type { VariableType } from "@/lib/computeClimate";

type Item = {
  id: string;
  icon: typeof Globe2;
  label: string;
  variable?: VariableType;
  anchor?: string;
  badge?: number;
};

const ITEMS: Item[] = [
  { id: "overview", icon: Globe2, label: "Overview", anchor: "section-overview" },
  { id: "heat", icon: Thermometer, label: "Heat Maps", variable: "temperature", anchor: "section-map" },
  { id: "rain", icon: CloudRain, label: "Rainfall", variable: "rainfall", anchor: "section-map" },
  { id: "extremes", icon: AlertTriangle, label: "Extremes", anchor: "section-extremes", badge: 7 },
  { id: "scenarios", icon: Sliders, label: "Scenarios", anchor: "section-scenarios" },
  { id: "sectors", icon: LayoutGrid, label: "Sectors", anchor: "section-sectors" },
  { id: "sources", icon: Database, label: "Data Sources", anchor: "section-sources" },
  { id: "reports", icon: FileBarChart, label: "Reports", anchor: "section-reports" },
];

export default function Sidebar() {
  const setVariable = useClimateStore((s) => s.setVariable);
  const activeVariable = useClimateStore((s) => s.activeVariable);
  const [activeId, setActiveId] = useState<string>("overview");

  const handleClick = (item: Item) => {
    setActiveId(item.id);
    if (item.variable) setVariable(item.variable);
    if (item.anchor) {
      const el = document.getElementById(item.anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[68px] shrink-0 flex-col border-r border-twin-border bg-twin-dark/80 px-2.5 py-4 backdrop-blur lg:flex">
      <Link to="/" className="mb-6 flex h-10 w-12 items-center justify-center rounded-lg bg-twin-cyan/10 ring-1 ring-twin-cyan/40">
        <Satellite className="h-5 w-5 text-twin-cyan" />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            activeId === item.id ||
            (item.variable && item.variable === activeVariable && (item.id === "heat" || item.id === "rain"));
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={`group relative flex h-11 w-12 items-center justify-center rounded-lg transition ${
                active
                  ? "bg-twin-cyan/15 text-twin-cyan ring-1 ring-twin-cyan/40"
                  : "text-twin-muted hover:bg-white/5 hover:text-twin-text"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.badge ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-twin-red px-1 font-mono text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
              <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md border border-twin-border bg-twin-mid px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-0 transition group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-twin-border pt-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-twin-teal opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-twin-teal" />
          </span>
        </div>
        <div className="mt-1 font-mono text-[8px] uppercase tracking-widest text-twin-muted">
          synced
          <br />
          15m
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("section-overview");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-3 flex h-10 w-12 items-center justify-center rounded-lg text-twin-muted hover:text-twin-text"
      >
        <Settings2 className="h-4 w-4" />
      </button>
    </aside>
  );
}

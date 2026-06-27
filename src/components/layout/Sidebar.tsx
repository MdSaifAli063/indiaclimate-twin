import { Link, useRouterState } from "@tanstack/react-router";
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

const ITEMS = [
  { to: "/dashboard", icon: Globe2, label: "Overview" },
  { to: "/dashboard?var=temperature", icon: Thermometer, label: "Heat Maps" },
  { to: "/dashboard?var=rainfall", icon: CloudRain, label: "Rainfall" },
  { to: "/dashboard?panel=extremes", icon: AlertTriangle, label: "Extremes", badge: 7 },
  { to: "/dashboard?panel=scenarios", icon: Sliders, label: "Scenarios" },
  { to: "/dashboard?panel=sectors", icon: LayoutGrid, label: "Sectors" },
  { to: "/dashboard?panel=sources", icon: Database, label: "Data Sources" },
  { to: "/dashboard?panel=reports", icon: FileBarChart, label: "Reports" },
];

export default function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[68px] shrink-0 flex-col border-r border-twin-border bg-twin-dark/80 px-2.5 py-4 backdrop-blur lg:flex">
      <Link to="/" className="mb-6 flex h-10 w-12 items-center justify-center rounded-lg bg-twin-cyan/10 ring-1 ring-twin-cyan/40">
        <Satellite className="h-5 w-5 text-twin-cyan" />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to.split("?")[0];
          return (
            <Link
              key={item.label}
              to={item.to.split("?")[0]}
              className={`group relative flex h-11 w-12 items-center justify-center rounded-lg transition ${
                active
                  ? "bg-twin-cyan/15 text-twin-cyan ring-1 ring-twin-cyan/40"
                  : "text-twin-muted hover:bg-white/5 hover:text-twin-text"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.badge ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-twin-red px-1 font-mono text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-twin-border bg-twin-mid px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-0 transition group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
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
      <Link
        to="/dashboard"
        className="mt-3 flex h-10 w-12 items-center justify-center rounded-lg text-twin-muted hover:text-twin-text"
      >
        <Settings2 className="h-4 w-4" />
      </Link>
    </aside>
  );
}

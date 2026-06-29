import { createFileRoute, Link } from "@tanstack/react-router";
import { Satellite, ArrowRight, Activity, Brain, Zap, Waves, Thermometer, Sprout } from "lucide-react";
import { CLIMATE_DATA, ZONE_COLORS } from "@/lib/climateData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClimateTwin India — AI-Powered Digital Twin of India's Climate" },
      {
        name: "description",
        content:
          "High-fidelity digital twin of India\u2019s climate system. ISRO satellite data + IMD ground networks + AI/ML modeling across 36 states.",
      },
      { property: "og:title", content: "ClimateTwin India" },
      { property: "og:description", content: "AI-powered digital twin of India\u2019s climate." },
    ],
  }),
  component: Landing,
});

const TICKER = [
  "Delhi 38.2°C ↑",
  "Kerala rainfall 284mm this week",
  "Rajasthan AQI 156",
  "Ladakh glacier retreat 2.1m YTD",
  "Bay of Bengal SST 29.8°C",
  "Mumbai humidity 78%",
  "Chennai cyclone watch — INCOIS",
  "Punjab groundwater -28m",
  "Meghalaya 5000mm/yr",
  "Assam Brahmaputra +1.8m",
];

const FEATURES = [
  { icon: Satellite, title: "Multi-source data fusion", body: "INSAT-3DR thermal + Oceansat winds + IMD ground + GRACE-FO gravity, harmonized at 15-min cadence." },
  { icon: Brain, title: "AI/ML climate modeling", body: "LSTM + physics-informed neural nets, ensemble of 50 members assimilated every 15 minutes." },
  { icon: Zap, title: "Near-real-time updates", body: "Satellite refresh in 15 minutes, ground-truth blending in 5, dashboard latency under 30 seconds." },
  { icon: Waves, title: "Monsoon variability capture", body: "Ensemble modeling resolves intra-seasonal monsoon breaks and active spells down to district scale." },
  { icon: Thermometer, title: "Extreme event early warning", body: "Cyclone, flood, heatwave, drought, glacier-retreat detection with 72h lead time." },
  { icon: Sprout, title: "Sector impact assessment", body: "Agriculture yield, water stress, urban heat, vector disease and renewable potential per state." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-twin-dark text-twin-text">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-twin-border bg-twin-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-twin-cyan/15 ring-1 ring-twin-cyan/50">
              <Satellite className="h-4 w-4 text-twin-cyan" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">
                ClimateTwin <span className="text-twin-cyan">India</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-twin-muted">
                AI-powered digital twin
              </div>
            </div>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              <span>ISRO</span><span>·</span><span>IMD</span><span>·</span><span>INCOIS</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-lg bg-twin-cyan px-4 py-2 text-xs font-bold uppercase tracking-widest text-twin-dark transition hover:gap-3"
          >
            Launch twin
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-twin-border">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-twin-cyan/30 bg-twin-cyan/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-twin-cyan">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-twin-cyan opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-twin-cyan" />
              </span>
              Live · ISRO Hackathon 2025
            </div>
            <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              India\u2019s climate,
              <br />
              <span className="text-glow text-twin-cyan">digitally replicated.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-twin-muted">
              A physics-informed AI twin of the subcontinent\u2019s atmosphere, oceans, and land surface —
              built on geostationary satellites, polar-orbit imagery, 550+ ground stations, and 50-member
              ensemble assimilation. Explore current state, project to 2100, and stress-test policy
              interventions across every state and union territory.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 rounded-lg bg-twin-cyan px-5 py-3 text-xs font-bold uppercase tracking-widest text-twin-dark transition hover:gap-3"
              >
                Open dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#states"
                className="rounded-lg border border-twin-border px-5 py-3 text-xs font-bold uppercase tracking-widest text-twin-text transition hover:border-twin-cyan/40 hover:text-twin-cyan"
              >
                Browse states
              </a>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <Stat n="36" l="States & UTs" />
              <Stat n="50" l="Ensemble members" />
              <Stat n="15m" l="Refresh cadence" />
            </div>
          </div>

          {/* Hero illustration */}
          <HeroIllustration />
        </div>

        {/* Live ticker */}
        <div className="border-t border-twin-border bg-twin-dark/60 py-2.5">
          <div className="overflow-hidden">
            <div
              className="flex gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-twin-muted"
              style={{ animation: "ticker 50s linear infinite", width: "max-content" }}
            >
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-twin-cyan" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-twin-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-widest text-twin-cyan">
              § 02 — Capabilities
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              What the twin can do.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card group p-6 transition hover:border-twin-cyan/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-twin-cyan/10 ring-1 ring-twin-cyan/30 transition group-hover:ring-twin-cyan">
                  <f.icon className="h-4 w-4 text-twin-cyan" />
                </div>
                <div className="text-base font-semibold">{f.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-twin-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section id="states" className="border-b border-twin-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-twin-cyan">
                § 03 — Explore
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Every state and territory.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-twin-muted">
                Pick any one of {CLIMATE_DATA.length} states and union territories to drill into its
                current state, monthly profile, projections, and sector impacts.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CLIMATE_DATA.map((s) => (
              <Link
                key={s.id}
                to="/dashboard"
                onClick={() => {
                  // store update happens via dashboard; users land on overview
                }}
                className="glass-card group flex flex-col gap-2 p-3.5 transition hover:border-twin-cyan/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 truncate text-sm font-semibold text-twin-text">{s.name}</div>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: ZONE_COLORS[s.zone] }}
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
                  {s.zone}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-twin-cyan">
                    {s.current.temperature}°
                  </span>
                  <span className="font-mono text-[11px] text-twin-muted">
                    {s.current.rainfall}mm
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-twin-muted">
                  <span className="font-mono text-[9px] uppercase tracking-widest">
                    {s.capital}
                  </span>
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:text-twin-cyan" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-twin-muted">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3" /> ClimateTwin India · ISRO Hackathon 2025
          </div>
          <div className="flex flex-wrap gap-4">
            <span>INSAT-3DR</span>
            <span>Oceansat-3</span>
            <span>IMD Network</span>
            <span>GRACE-FO</span>
            <span>MOSDAC</span>
            <span>Bhuvan</span>
            <span>CWC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-mono text-2xl font-bold text-twin-cyan">{n}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">{l}</div>
    </div>
  );
}

function HeroIllustration() {
  // Approximate India outline path + floating labels
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-twin-cyan/15 via-transparent to-transparent blur-3xl" />
      <svg viewBox="0 0 400 480" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="indiaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.25" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        {/* concentric grid arcs */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={i}
            cx="200"
            cy="240"
            rx={70 + i * 35}
            ry={90 + i * 38}
            fill="none"
            stroke="rgba(0,245,255,0.08)"
            strokeDasharray="2 4"
          />
        ))}
        {/* India outline approximation */}
        <path
          d="M170 60 Q190 50 220 60 Q255 70 270 90 L290 130 Q300 160 285 195 L300 225 Q330 245 320 285 L300 330 Q280 380 240 420 L210 445 Q190 430 180 405 Q175 380 165 360 L150 320 Q130 290 130 255 L120 215 Q115 180 130 150 L150 110 Q160 80 170 60 Z"
          fill="url(#indiaG)"
          stroke="#00f5ff"
          strokeWidth="1.4"
          filter="url(#glow)"
        />
        <path
          d="M170 60 Q190 50 220 60 Q255 70 270 90 L290 130 Q300 160 285 195 L300 225 Q330 245 320 285 L300 330 Q280 380 240 420 L210 445 Q190 430 180 405 Q175 380 165 360 L150 320 Q130 290 130 255 L120 215 Q115 180 130 150 L150 110 Q160 80 170 60 Z"
          fill="none"
          stroke="#00f5ff"
          strokeWidth="0.8"
          style={{ animation: "pulse-ring 4s ease-in-out infinite" }}
        />
        {/* dots */}
        {[
          { x: 200, y: 130, label: "Delhi" },
          { x: 175, y: 200, label: "Mumbai" },
          { x: 230, y: 240, label: "Hyderabad" },
          { x: 200, y: 360, label: "Kerala" },
          { x: 270, y: 250, label: "Bengaluru" },
          { x: 230, y: 175, label: "Bhopal" },
          { x: 280, y: 320, label: "Chennai" },
          { x: 250, y: 110, label: "Lucknow" },
        ].map((d) => (
          <g key={d.label}>
            <circle cx={d.x} cy={d.y} r="3" fill="#00f5ff" />
            <circle cx={d.x} cy={d.y} r="6" fill="none" stroke="#00f5ff" strokeOpacity="0.4">
              <animate attributeName="r" values="3;10;3" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      {/* floating labels */}
      <FloatingLabel className="left-[68%] top-[6%]" tag="Temperature" value="28.4°C" />
      <FloatingLabel className="left-[2%] top-[28%]" tag="Rainfall" value="1240 mm" />
      <FloatingLabel className="left-[72%] top-[34%]" tag="Wind" value="14 km/h" />
      <FloatingLabel className="left-[4%] top-[64%]" tag="Soil moisture" value="42%" />
      <FloatingLabel className="left-[68%] top-[66%]" tag="AQI" value="118" />
      {/* orbit */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-twin-cyan/20"
          style={{ borderStyle: "dashed", transform: "translate(-50%,-50%) rotate(-12deg) scaleY(0.35)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "orbit 14s linear infinite" }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-twin-cyan/20 ring-1 ring-twin-cyan/60 backdrop-blur"
            style={{ transform: "translateX(208px) scaleY(0.35) rotate(12deg)" }}
          >
            <Satellite className="h-3.5 w-3.5 text-twin-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingLabel({ className, tag, value }: { className: string; tag: string; value: string }) {
  return (
    <div
      className={`absolute ${className} rounded-md border border-twin-cyan/30 bg-twin-dark/85 px-2.5 py-1.5 backdrop-blur`}
      style={{ animation: "float-y 4s ease-in-out infinite" }}
    >
      <div className="font-mono text-[8px] uppercase tracking-widest text-twin-muted">{tag}</div>
      <div className="font-mono text-sm font-bold text-twin-cyan">{value}</div>
    </div>
  );
}

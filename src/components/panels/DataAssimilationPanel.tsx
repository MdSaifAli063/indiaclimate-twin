const SOURCES = [
  { name: "INSAT-3DR", status: 100, bars: 5, last: "14:32 IST", desc: "Thermal + WV" },
  { name: "Oceansat-3", status: 80, bars: 4, last: "13:58 IST", desc: "SST + Wind" },
  { name: "IMD Network", status: 99, bars: 5, last: "14:35 IST", desc: "550 stations" },
  { name: "GRACE-FO", status: 65, bars: 3, last: "Nov 30", desc: "Groundwater" },
  { name: "CWC Gauges", status: 87, bars: 4, last: "14:28 IST", desc: "River flow" },
  { name: "Bhuvan LISS", status: 100, bars: 5, last: "Dec 01", desc: "Land use / NDVI" },
  { name: "Argo Floats", status: 40, bars: 2, last: "14:10 IST", desc: "Ocean profile" },
];

export default function DataAssimilationPanel() {
  return (
    <div className="glass-card flex h-full flex-col p-5">
      <div className="mb-1 text-sm font-semibold text-twin-text">Data assimilation status</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
        Live fusion of multi-source observations
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {SOURCES.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-2 rounded-md border border-twin-border bg-twin-dark/40 px-3 py-2"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-twin-text">{s.name}</span>
                <span className="font-mono text-[10px] text-twin-muted">{s.desc}</span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-twin-muted">
                Last: {s.last}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-1 rounded-sm ${
                      i < s.bars
                        ? s.status > 80
                          ? "bg-twin-teal"
                          : s.status > 60
                            ? "bg-twin-amber"
                            : "bg-twin-orange"
                        : "bg-twin-border"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-twin-cyan">{s.status}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-twin-border pt-3 font-mono text-[10px] uppercase tracking-widest text-twin-muted">
        <div className="flex items-center justify-between">
          <span>Model last updated</span>
          <span className="text-twin-text">15m ago</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Next assimilation cycle</span>
          <span className="text-twin-text">14:45 IST</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Ensemble members · cycles/day</span>
          <span className="text-twin-text">50 · 96</span>
        </div>
      </div>
    </div>
  );
}

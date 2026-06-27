import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { useClimateStore } from "@/hooks/useClimateStore";
import { getStateById } from "@/lib/climateData";
import { generateInsights } from "@/lib/aiInsights";

const SEV_COLOR: Record<string, string> = {
  critical: "text-twin-red border-twin-red/40 bg-twin-red/10",
  high: "text-twin-orange border-twin-orange/40 bg-twin-orange/10",
  moderate: "text-twin-amber border-twin-amber/40 bg-twin-amber/10",
  info: "text-twin-teal border-twin-teal/40 bg-twin-teal/10",
};

export default function AIInsightsPanel() {
  const { selectedStateId, scenario, targetYear } = useClimateStore();
  const state = selectedStateId ? getStateById(selectedStateId) : null;
  const insights = useMemo(
    () => (state ? generateInsights(state, scenario, targetYear) : []),
    [state, scenario, targetYear],
  );
  const [thinking, setThinking] = useState(false);
  useEffect(() => {
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 600);
    return () => clearTimeout(t);
  }, [selectedStateId, scenario, targetYear]);

  return (
    <div className="glass-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-twin-cyan/10 ring-1 ring-twin-cyan/40">
              <Brain className="h-4 w-4 text-twin-cyan" />
            </div>
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-twin-teal opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-twin-teal" />
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-twin-text">AI climate intelligence</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              Ensemble LSTM \u00b7 PINN \u00b7 50 members
            </div>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-twin-cyan" />
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {thinking ? (
            <motion.div
              key="t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-8 text-xs text-twin-muted"
            >
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-twin-cyan" />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-twin-cyan [animation-delay:120ms]" />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-twin-cyan [animation-delay:240ms]" />
              <span className="ml-2 font-mono uppercase tracking-widest">Synthesizing\u2026</span>
            </motion.div>
          ) : (
            <motion.div key="r" className="space-y-2.5">
              {insights.map((ins, i) => (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-lg border p-3 ${SEV_COLOR[ins.severity]}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold leading-tight">{ins.title}</div>
                    <span className="rounded px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest opacity-80">
                      {ins.category}
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-twin-text/85">{ins.body}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

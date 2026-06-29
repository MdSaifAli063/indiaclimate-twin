import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, CloudRain, Droplets, AlertTriangle, Wind } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import DigitalTwinMap from "@/components/map/DigitalTwinMap";
import AIInsightsPanel from "@/components/panels/AIInsightsPanel";
import ExtremesPanel from "@/components/panels/ExtremesPanel";
import DataAssimilationPanel from "@/components/panels/DataAssimilationPanel";
import StatCard from "@/components/panels/StatCard";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import ProjectionTimelineChart from "@/components/charts/ProjectionTimelineChart";
import SectorRadarChart from "@/components/charts/SectorRadarChart";
import RegionCompareChart from "@/components/charts/RegionCompareChart";
import ScenarioSimulator from "@/components/dashboard/ScenarioSimulator";
import { useClimateStore } from "@/hooks/useClimateStore";
import { getStateById, CLIMATE_DATA } from "@/lib/climateData";
import { projectedTemperature, projectedRainfall } from "@/lib/computeClimate";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ClimateTwin India" },
      {
        name: "description",
        content:
          "Real-time digital twin of India’s climate — satellite + ground fusion, AI projections, and sector-impact analysis across 36 states.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { selectedStateId, scenario, targetYear } = useClimateStore();
  const state = selectedStateId ? getStateById(selectedStateId) : null;
  const display = state ?? CLIMATE_DATA[0];

  const temp = projectedTemperature(display, targetYear, scenario);
  const rain = projectedRainfall(display, targetYear, scenario);
  const activeAlerts = 7;

  return (
    <div className="flex min-h-screen w-full bg-twin-dark text-twin-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="space-y-5 px-5 py-5 scroll-smooth">
          {/* Row 1: stat cards */}
          <div id="section-overview" className="scroll-mt-20 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Mean temperature"
              value={temp}
              unit="°C"
              delta={`${(temp - display.current.temperature).toFixed(1)}°C`}
              trend={temp > display.current.temperature ? "up" : "flat"}
              icon={<Thermometer className="h-4 w-4" />}
              accent="#ff8c42"
            />
            <StatCard
              label="Annual rainfall"
              value={rain}
              decimals={0}
              unit="mm"
              delta={`${(((rain - display.current.rainfall) / display.current.rainfall) * 100).toFixed(1)}%`}
              trend={rain > display.current.rainfall ? "up" : "down"}
              icon={<CloudRain className="h-4 w-4" />}
              accent="#0ea5e9"
            />
            <StatCard
              label="Humidity"
              value={display.current.humidity}
              decimals={0}
              unit="%"
              delta="2%"
              trend="up"
              icon={<Droplets className="h-4 w-4" />}
              accent="#00d4aa"
            />
            <StatCard
              label="Active extremes"
              value={activeAlerts}
              decimals={0}
              unit="events"
              delta="3"
              trend="up"
              icon={<AlertTriangle className="h-4 w-4" />}
              accent="#fbbf24"
            />
            <StatCard
              label="Air quality"
              value={display.current.aqi}
              decimals={0}
              unit="AQI"
              delta={display.sectors.health.airQualityTrend}
              trend={display.sectors.health.airQualityTrend === "worsening" ? "up" : "flat"}
              icon={<Wind className="h-4 w-4" />}
              accent="#a78bfa"
            />
          </div>

          {/* Row 2: map + AI insights */}
          <div id="section-map" className="scroll-mt-20 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="h-[560px]">
                <DigitalTwinMap />
              </div>
            </div>
            <div className="h-[560px]">
              <AIInsightsPanel />
            </div>
          </div>

          {/* Row 3: 3 charts */}
          <div id="section-sectors" className="scroll-mt-20 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="h-[320px]">
              <MonthlyTrendChart state={display} />
            </div>
            <div className="h-[320px]">
              <ProjectionTimelineChart state={display} active={scenario} />
            </div>
            <div className="h-[320px]">
              <SectorRadarChart state={display} />
            </div>
          </div>

          {/* Row 4: extremes + data status */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div id="section-extremes" className="scroll-mt-20 h-[480px]">
              <ExtremesPanel />
            </div>
            <div id="section-sources" className="scroll-mt-20 h-[480px]">
              <DataAssimilationPanel />
            </div>
          </div>

          {/* Row 5: simulator */}
          <div id="section-scenarios" className="scroll-mt-20">
            <ScenarioSimulator />
          </div>

          {/* Row 6: regional comparison */}
          <div id="section-reports" className="scroll-mt-20">
            <RegionCompareChart />
          </div>


          <footer className="border-t border-twin-border pt-5 pb-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-twin-muted">
              ClimateTwin India · Built for ISRO Hackathon 2025 · Data: INSAT-3DR, IMD, INCOIS, CWC, GRACE-FO, Bhuvan
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

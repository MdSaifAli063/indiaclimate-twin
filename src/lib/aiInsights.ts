import type { StateClimateData } from "./climateData";
import { type Scenario, SCENARIO_META, interpolateProjection } from "./computeClimate";

export type Insight = {
  id: string;
  category: "temperature" | "rainfall" | "extreme" | "sector";
  severity: "info" | "moderate" | "high" | "critical";
  title: string;
  body: string;
};

export function generateInsights(
  state: StateClimateData,
  scenario: Scenario,
  year: number,
): Insight[] {
  const p = interpolateProjection(state, year);
  const mult = SCENARIO_META[scenario].multiplier;
  const tempDelta = p.tempDelta * mult;
  const rainDelta = p.rainfallDelta * mult;
  const projected = state.current.temperature + tempDelta;

  const out: Insight[] = [];

  // Temperature
  out.push({
    id: "temp",
    category: "temperature",
    severity: projected > 35 ? "critical" : projected > 30 ? "high" : "moderate",
    title:
      projected > 35
        ? `Extreme heat regime by ${year}`
        : `Warming trend +${tempDelta.toFixed(1)}°C by ${year}`,
    body:
      projected > 35
        ? `${state.name} projected mean ${projected.toFixed(1)}°C under ${SCENARIO_META[scenario].label} — ${tempDelta.toFixed(1)}°C above 30-yr baseline. Heat-stress mortality risk rises sharply.`
        : `${state.name} mean temperature shifts to ${projected.toFixed(1)}°C, ${tempDelta.toFixed(1)}°C above the 1991–2020 climatological baseline under ${SCENARIO_META[scenario].label}.`,
  });

  // Rainfall
  out.push({
    id: "rain",
    category: "rainfall",
    severity: Math.abs(rainDelta) > 15 ? "high" : "moderate",
    title:
      rainDelta < -10
        ? `Monsoon deficit −${Math.abs(rainDelta).toFixed(1)}%`
        : rainDelta > 10
          ? `Increased precipitation +${rainDelta.toFixed(1)}%`
          : `Rainfall relatively stable: ${rainDelta >= 0 ? "+" : ""}${rainDelta.toFixed(1)}%`,
    body:
      rainDelta < -10
        ? `Significant rainfall reduction projected for the ${state.sectors.water.riverBasin} basin. Reservoir reliability and rabi sowing windows compressed.`
        : rainDelta > 10
          ? `Intensification of monsoon over ${state.name}. Flood-plain exposure (${state.sectors.water.floodPlainArea.toLocaleString()} km²) elevates inundation risk.`
          : `Total annual rainfall stays close to current ${state.current.rainfall} mm, but intra-seasonal variability increases.`,
  });

  // Extreme events
  const main =
    state.sectors.agriculture.floodRisk === "extreme"
      ? "flood"
      : state.sectors.agriculture.droughtRisk === "extreme"
        ? "drought"
        : state.zone === "coastal"
          ? "cyclone"
          : projected > 38
            ? "heatwave"
            : "thunderstorm";
  out.push({
    id: "extreme",
    category: "extreme",
    severity: "high",
    title: `${main[0].toUpperCase() + main.slice(1)} risk elevated`,
    body: `${state.name} extreme-event frequency rises ${(p.extremeEvents).toFixed(0)} events/yr by ${year} — driven by ${main === "cyclone" ? "Bay of Bengal SST +1.2°C and intensified low-pressure systems" : main === "flood" ? "compressed monsoon bursts and saturated catchments" : main === "drought" ? "weakened westerlies and reduced soil moisture" : "heat-dome circulations and stagnant air"}.`,
  });

  // Sector (rotate based on biggest risk)
  const ag = state.sectors.agriculture.cropYieldChange2050;
  out.push({
    id: "sector",
    category: "sector",
    severity: ag < -15 ? "critical" : "high",
    title: `Agriculture: ${ag}% yield change by 2050`,
    body: `${state.sectors.agriculture.mainCrops.slice(0, 3).join(", ")} systems projected ${ag}% yield shift. Irrigation demand reaches ${state.sectors.agriculture.irrigationDemand} mm/yr; ${state.sectors.water.riverBasin} reservoirs currently at ${state.sectors.water.reservoirLevel}% capacity.`,
  });

  return out;
}

export function generateExtremeEvents(
  state: StateClimateData,
): Array<{
  id: string;
  type: string;
  severity: "watch" | "warning" | "severe" | "extreme";
  title: string;
  description: string;
  probability: number;
  source: string;
  validUntil: string;
}> {
  const events: ReturnType<typeof generateExtremeEvents> = [];
  const now = Date.now();
  const tomorrow = new Date(now + 1000 * 60 * 60 * 36).toISOString();
  const week = new Date(now + 1000 * 60 * 60 * 24 * 7).toISOString();

  if (state.sectors.agriculture.floodRisk === "extreme") {
    events.push({
      id: `${state.id}-flood`,
      type: "flood",
      severity: "severe",
      title: `Flood warning: ${state.name}`,
      description: `${state.sectors.water.riverBasin} basin running above danger mark. ${state.sectors.water.floodPlainArea.toLocaleString()} km² flood-plain at risk over the next 72h.`,
      probability: 78,
      source: "CWC",
      validUntil: week,
    });
  }
  if (state.zone === "coastal" && state.sectors.agriculture.floodRisk !== "low") {
    events.push({
      id: `${state.id}-cyclone`,
      type: "cyclone",
      severity: "warning",
      title: `Cyclone watch: ${state.coordinates.lat > 15 ? "Bay of Bengal" : "Arabian Sea"}`,
      description: `Low-pressure system intensifying off the ${state.name} coast. Possible cyclogenesis within 96h; coastal districts on alert.`,
      probability: 64,
      source: "INCOIS",
      validUntil: week,
    });
  }
  if (state.sectors.agriculture.droughtRisk === "extreme" || state.sectors.agriculture.droughtRisk === "high") {
    events.push({
      id: `${state.id}-drought`,
      type: "drought",
      severity: state.sectors.agriculture.droughtRisk === "extreme" ? "severe" : "warning",
      title: `Drought ${state.sectors.agriculture.droughtRisk === "extreme" ? "warning" : "watch"}: ${state.name}`,
      description: `Soil moisture at ${state.current.soilMoisture}% — below seasonal normal. Groundwater levels declining to ${state.current.groundwaterLevel}m below surface.`,
      probability: state.sectors.agriculture.droughtRisk === "extreme" ? 82 : 58,
      source: "IMD",
      validUntil: week,
    });
  }
  if (state.current.temperature > 28 && state.monthly.temperature.some((t) => t > 36)) {
    events.push({
      id: `${state.id}-heat`,
      type: "heatwave",
      severity: "warning",
      title: `Heatwave alert: ${state.name}`,
      description: `Peak summer temperatures forecast to exceed 40°C. Heat-stress index ${state.sectors.health.heatStressIndex}/100 — vulnerable populations advised to limit exposure 11:00–16:00.`,
      probability: 71,
      source: "IMD",
      validUntil: tomorrow,
    });
  }
  if (state.current.snowCover > 30) {
    events.push({
      id: `${state.id}-glacier`,
      type: "glacier-retreat",
      severity: "watch",
      title: `Glacier retreat monitoring: ${state.name}`,
      description: `Snow cover at ${state.current.snowCover}%. ${state.sectors.water.riverBasin} headwater glaciers losing 1.8–2.4 m water-equivalent annually per GRACE-FO observations.`,
      probability: 88,
      source: "GRACE-FO",
      validUntil: week,
    });
  }
  if (state.current.aqi > 150) {
    events.push({
      id: `${state.id}-aqi`,
      type: "fog",
      severity: state.current.aqi > 200 ? "severe" : "warning",
      title: `Air quality alert: ${state.name}`,
      description: `AQI ${state.current.aqi} — ${state.current.aqi > 200 ? "very poor" : "poor"} category. Particulate pollution combined with low boundary-layer mixing.`,
      probability: 92,
      source: "CPCB",
      validUntil: tomorrow,
    });
  }
  return events;
}

import type { StateClimateData, Projection } from "./climateData";

export type Scenario = "rcp26" | "rcp45" | "rcp60" | "rcp85";

export const SCENARIO_META: Record<
  Scenario,
  { label: string; full: string; color: string; multiplier: number; sub: string }
> = {
  rcp26: { label: "RCP 2.6", full: "Aggressive mitigation", color: "#4f8df8", multiplier: 0.45, sub: "Peak 2020, net-zero 2070" },
  rcp45: { label: "RCP 4.5", full: "Moderate mitigation", color: "#00d4aa", multiplier: 0.7, sub: "Stabilize at 4.5 W/m\u00b2" },
  rcp60: { label: "RCP 6.0", full: "Weak mitigation", color: "#ff8c42", multiplier: 0.88, sub: "Stabilize at 6.0 W/m\u00b2" },
  rcp85: { label: "RCP 8.5", full: "Business as usual", color: "#ff4d2e", multiplier: 1.0, sub: "Continued high emissions" },
};

const YEAR_KEYS: Array<{ year: number; key: keyof StateClimateData["projections"] }> = [
  { year: 2030, key: "year2030" },
  { year: 2040, key: "year2040" },
  { year: 2050, key: "year2050" },
  { year: 2075, key: "year2075" },
  { year: 2100, key: "year2100" },
];

export function interpolateProjection(
  state: StateClimateData,
  year: number,
): Projection {
  if (year <= 2024) return { tempDelta: 0, rainfallDelta: 0, extremeEvents: 0 };
  let lo = { year: 2024, p: { tempDelta: 0, rainfallDelta: 0, extremeEvents: 0 } as Projection };
  let hi = { year: 2030, p: state.projections.year2030 };
  for (let i = 0; i < YEAR_KEYS.length; i++) {
    const k = YEAR_KEYS[i];
    if (year <= k.year) {
      hi = { year: k.year, p: state.projections[k.key] };
      lo = i === 0
        ? { year: 2024, p: { tempDelta: 0, rainfallDelta: 0, extremeEvents: 0 } }
        : { year: YEAR_KEYS[i - 1].year, p: state.projections[YEAR_KEYS[i - 1].key] };
      break;
    }
    if (i === YEAR_KEYS.length - 1) {
      hi = { year: k.year, p: state.projections[k.key] };
      lo = hi;
    }
  }
  const span = hi.year - lo.year || 1;
  const t = (year - lo.year) / span;
  return {
    tempDelta: lo.p.tempDelta + (hi.p.tempDelta - lo.p.tempDelta) * t,
    rainfallDelta: lo.p.rainfallDelta + (hi.p.rainfallDelta - lo.p.rainfallDelta) * t,
    extremeEvents: lo.p.extremeEvents + (hi.p.extremeEvents - lo.p.extremeEvents) * t,
  };
}

export function projectedTemperature(
  state: StateClimateData,
  year: number,
  scenario: Scenario,
): number {
  const p = interpolateProjection(state, year);
  return state.current.temperature + p.tempDelta * SCENARIO_META[scenario].multiplier;
}

export function projectedRainfall(
  state: StateClimateData,
  year: number,
  scenario: Scenario,
): number {
  const p = interpolateProjection(state, year);
  return state.current.rainfall * (1 + (p.rainfallDelta / 100) * SCENARIO_META[scenario].multiplier);
}

export type VariableType =
  | "temperature"
  | "rainfall"
  | "humidity"
  | "windSpeed"
  | "soilMoisture"
  | "aqi"
  | "groundwaterLevel"
  | "snowCover"
  | "cloudCover"
  | "uvIndex";

export const VARIABLE_META: Record<
  VariableType,
  { label: string; unit: string; short: string }
> = {
  temperature: { label: "Temperature", unit: "\u00b0C", short: "Temp" },
  rainfall: { label: "Rainfall", unit: "mm", short: "Rain" },
  humidity: { label: "Humidity", unit: "%", short: "RH" },
  windSpeed: { label: "Wind Speed", unit: "km/h", short: "Wind" },
  soilMoisture: { label: "Soil Moisture", unit: "%", short: "Soil" },
  aqi: { label: "Air Quality Index", unit: "AQI", short: "AQI" },
  groundwaterLevel: { label: "Groundwater Depth", unit: "m", short: "GW" },
  snowCover: { label: "Snow Cover", unit: "%", short: "Snow" },
  cloudCover: { label: "Cloud Cover", unit: "%", short: "Cloud" },
  uvIndex: { label: "UV Index", unit: "", short: "UV" },
};

export function getVariableValue(
  state: StateClimateData,
  variable: VariableType,
  year: number,
  scenario: Scenario,
): number {
  if (variable === "temperature") return projectedTemperature(state, year, scenario);
  if (variable === "rainfall") return projectedRainfall(state, year, scenario);
  return state.current[variable];
}

// Color scales: returns hex/rgb interpolated for a given normalized [0,1] value.
function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function lerpColor(c1: number[], c2: number[], t: number): string {
  return `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;
}

const SCALES: Record<VariableType, Array<[number, number[]]>> = {
  temperature: [
    [-10, [33, 102, 172]],
    [15, [67, 147, 195]],
    [22, [146, 197, 222]],
    [28, [244, 165, 130]],
    [33, [214, 96, 77]],
    [42, [178, 24, 43]],
  ],
  rainfall: [
    [0, [255, 255, 212]],
    [400, [254, 227, 145]],
    [900, [120, 200, 130]],
    [1600, [65, 171, 93]],
    [2400, [0, 104, 55]],
    [5000, [0, 51, 25]],
  ],
  humidity: [
    [20, [240, 220, 160]],
    [50, [180, 220, 200]],
    [70, [80, 180, 200]],
    [90, [20, 100, 180]],
  ],
  windSpeed: [
    [0, [200, 230, 240]],
    [10, [120, 200, 230]],
    [20, [60, 150, 220]],
    [30, [30, 80, 180]],
  ],
  soilMoisture: [
    [0, [220, 180, 120]],
    [30, [200, 200, 140]],
    [60, [110, 180, 130]],
    [90, [40, 130, 180]],
  ],
  aqi: [
    [0, [0, 228, 0]],
    [50, [255, 255, 0]],
    [100, [255, 126, 0]],
    [150, [255, 0, 0]],
    [200, [143, 63, 151]],
    [300, [126, 0, 35]],
  ],
  groundwaterLevel: [
    [0, [60, 170, 220]],
    [10, [120, 200, 200]],
    [20, [220, 180, 100]],
    [35, [180, 60, 40]],
  ],
  snowCover: [
    [0, [60, 100, 140]],
    [20, [140, 180, 220]],
    [50, [200, 220, 240]],
    [100, [255, 255, 255]],
  ],
  cloudCover: [
    [0, [40, 80, 120]],
    [50, [120, 160, 200]],
    [100, [220, 230, 240]],
  ],
  uvIndex: [
    [0, [80, 180, 120]],
    [5, [240, 220, 80]],
    [8, [255, 140, 60]],
    [11, [220, 40, 80]],
  ],
};

export function colorFor(variable: VariableType, value: number): string {
  const scale = SCALES[variable];
  if (value <= scale[0][0]) return lerpColor(scale[0][1], scale[0][1], 0);
  if (value >= scale[scale.length - 1][0])
    return lerpColor(scale[scale.length - 1][1], scale[scale.length - 1][1], 0);
  for (let i = 0; i < scale.length - 1; i++) {
    const [v1, c1] = scale[i];
    const [v2, c2] = scale[i + 1];
    if (value >= v1 && value <= v2) {
      const t = (value - v1) / (v2 - v1);
      return lerpColor(c1, c2, t);
    }
  }
  return "rgb(120,120,120)";
}

export function scaleStops(variable: VariableType): Array<{ value: number; color: string; label: string }> {
  return SCALES[variable].map(([v, c]) => ({
    value: v,
    color: `rgb(${c[0]},${c[1]},${c[2]})`,
    label: String(v),
  }));
}

// Comprehensive climate dataset for all 36 Indian states/UTs.
// Values are realistic order-of-magnitude figures derived from IMD long-term
// normals, ISRO/MOSDAC, and IPCC AR6 regional projections. Used for the
// digital-twin demo — NOT for operational decision-making.

export type ClimateZone =
  | "tropical"
  | "arid"
  | "semi-arid"
  | "humid-subtropical"
  | "highland"
  | "coastal"
  | "monsoon"
  | "alpine";

export type RiskLevel = "low" | "medium" | "high" | "extreme";

export type Region =
  | "north"
  | "south"
  | "east"
  | "west"
  | "northeast"
  | "central"
  | "ut";

export type ExtremeEvent = {
  id: string;
  type:
    | "cyclone"
    | "flood"
    | "drought"
    | "heatwave"
    | "coldwave"
    | "landslide"
    | "thunderstorm"
    | "fog"
    | "glacier-retreat";
  severity: "watch" | "warning" | "severe" | "extreme";
  title: string;
  description: string;
  affectedArea: string;
  timestamp: string;
  probability: number;
};

export type ClimateAlert = {
  id: string;
  type: string;
  severity: "info" | "moderate" | "high" | "critical";
  message: string;
  source: string;
  validUntil: string;
};

export type Projection = {
  tempDelta: number;
  rainfallDelta: number;
  extremeEvents: number;
};

export type StateClimateData = {
  id: string;
  name: string;
  geoName: string; // matches GeoJSON NAME_1
  capital: string;
  region: Region;
  coordinates: { lat: number; lng: number };
  zone: ClimateZone;
  area: number;
  population: number;
  current: {
    temperature: number;
    rainfall: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    cloudCover: number;
    uvIndex: number;
    aqi: number;
    soilMoisture: number;
    groundwaterLevel: number;
    snowCover: number;
    evapotranspiration: number;
  };
  monthly: {
    temperature: number[];
    rainfall: number[];
    humidity: number[];
    windSpeed: number[];
  };
  projections: {
    year2030: Projection;
    year2040: Projection;
    year2050: Projection;
    year2075: Projection;
    year2100: Projection;
  };
  sectors: {
    agriculture: {
      cropYieldChange2050: number;
      irrigationDemand: number;
      floodRisk: RiskLevel;
      droughtRisk: RiskLevel;
      mainCrops: string[];
    };
    water: {
      riverBasin: string;
      annualFlow: number;
      reservoirLevel: number;
      floodPlainArea: number;
    };
    urban: {
      heatIslandIntensity: number;
      urbanizationRate: number;
      greenCoverPercent: number;
    };
    health: {
      heatStressIndex: number;
      vectorDiseaseRisk: "low" | "medium" | "high";
      airQualityTrend: "improving" | "stable" | "worsening";
    };
    energy: {
      renewablePotential: number;
      coolingDemandIncrease: number;
    };
  };
  extremeEvents: ExtremeEvent[];
  alerts: ClimateAlert[];
  dataSources: string[];
};

// Helper to generate monthly humidity / wind from base values
const hum = (base: number): number[] =>
  [
    base - 10,
    base - 12,
    base - 14,
    base - 8,
    base - 4,
    base + 8,
    base + 14,
    base + 14,
    base + 10,
    base + 2,
    base - 6,
    base - 8,
  ].map((v) => Math.max(20, Math.min(95, Math.round(v))));

const wind = (base: number): number[] =>
  [
    base - 2,
    base - 1,
    base,
    base + 2,
    base + 3,
    base + 4,
    base + 4,
    base + 3,
    base + 1,
    base - 1,
    base - 2,
    base - 2,
  ].map((v) => Math.max(2, Math.round(v)));

const proj = (
  d30: number,
  r30: number,
  d50: number,
  r50: number,
  d100: number,
  r100: number,
  e: number,
): StateClimateData["projections"] => ({
  year2030: { tempDelta: d30, rainfallDelta: r30, extremeEvents: e },
  year2040: {
    tempDelta: +(d30 + (d50 - d30) * 0.5).toFixed(2),
    rainfallDelta: +(r30 + (r50 - r30) * 0.5).toFixed(1),
    extremeEvents: Math.round(e * 1.4),
  },
  year2050: { tempDelta: d50, rainfallDelta: r50, extremeEvents: Math.round(e * 1.9) },
  year2075: {
    tempDelta: +(d50 + (d100 - d50) * 0.55).toFixed(2),
    rainfallDelta: +(r50 + (r100 - r50) * 0.55).toFixed(1),
    extremeEvents: Math.round(e * 2.7),
  },
  year2100: { tempDelta: d100, rainfallDelta: r100, extremeEvents: Math.round(e * 3.6) },
});

export const CLIMATE_DATA: StateClimateData[] = [
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    geoName: "Andhra Pradesh",
    capital: "Amaravati",
    region: "south",
    coordinates: { lat: 15.9, lng: 79.74 },
    zone: "coastal",
    area: 162968,
    population: 53900000,
    current: { temperature: 28.4, rainfall: 975, humidity: 68, windSpeed: 14, pressure: 1009, cloudCover: 52, uvIndex: 9, aqi: 96, soilMoisture: 38, groundwaterLevel: 12, snowCover: 0, evapotranspiration: 5.2 },
    monthly: {
      temperature: [25, 27, 30, 33, 35, 32, 28, 28, 28, 27, 25, 24],
      rainfall: [10, 8, 10, 15, 25, 55, 120, 140, 170, 150, 80, 20],
      humidity: hum(68), windSpeed: wind(14),
    },
    projections: proj(0.9, -3, 1.9, -7, 3.4, -12, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -14, irrigationDemand: 920, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Rice", "Cotton", "Chilli", "Tobacco"] },
      water: { riverBasin: "Krishna / Godavari", annualFlow: 110, reservoirLevel: 58, floodPlainArea: 9400 },
      urban: { heatIslandIntensity: 2.8, urbanizationRate: 1.4, greenCoverPercent: 18 },
      health: { heatStressIndex: 68, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 44, coolingDemandIncrease: 38 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "Oceansat-3"],
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    geoName: "Arunachal Pradesh",
    capital: "Itanagar",
    region: "northeast",
    coordinates: { lat: 28.22, lng: 94.73 },
    zone: "highland",
    area: 83743,
    population: 1530000,
    current: { temperature: 15.2, rainfall: 2800, humidity: 78, windSpeed: 8, pressure: 985, cloudCover: 72, uvIndex: 6, aqi: 38, soilMoisture: 72, groundwaterLevel: 5, snowCover: 12, evapotranspiration: 3.1 },
    monthly: {
      temperature: [8, 10, 13, 17, 20, 22, 23, 23, 21, 18, 13, 9],
      rainfall: [50, 80, 140, 200, 350, 450, 500, 480, 380, 200, 50, 30],
      humidity: hum(78), windSpeed: wind(8),
    },
    projections: proj(1.1, 4, 2.2, 8, 3.9, 14, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -8, irrigationDemand: 320, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Maize", "Millet", "Orange"] },
      water: { riverBasin: "Brahmaputra", annualFlow: 220, reservoirLevel: 82, floodPlainArea: 3800 },
      urban: { heatIslandIntensity: 0.8, urbanizationRate: 0.6, greenCoverPercent: 79 },
      health: { heatStressIndex: 22, vectorDiseaseRisk: "medium", airQualityTrend: "improving" },
      energy: { renewablePotential: 58, coolingDemandIncrease: 18 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "GRACE-FO"],
  },
  {
    id: "assam",
    name: "Assam",
    geoName: "Assam",
    capital: "Dispur",
    region: "northeast",
    coordinates: { lat: 26.2, lng: 92.93 },
    zone: "monsoon",
    area: 78438,
    population: 35600000,
    current: { temperature: 24.8, rainfall: 1900, humidity: 82, windSpeed: 9, pressure: 1004, cloudCover: 68, uvIndex: 7, aqi: 78, soilMoisture: 68, groundwaterLevel: 4, snowCover: 0, evapotranspiration: 4.1 },
    monthly: {
      temperature: [16, 18, 23, 26, 28, 29, 29, 29, 28, 26, 21, 16],
      rainfall: [20, 30, 70, 140, 250, 320, 350, 300, 220, 80, 20, 10],
      humidity: hum(82), windSpeed: wind(9),
    },
    projections: proj(1.0, 6, 2.1, 11, 3.6, 18, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -11, irrigationDemand: 440, floodRisk: "extreme", droughtRisk: "low", mainCrops: ["Tea", "Rice", "Jute", "Mustard"] },
      water: { riverBasin: "Brahmaputra", annualFlow: 538, reservoirLevel: 76, floodPlainArea: 31500 },
      urban: { heatIslandIntensity: 1.4, urbanizationRate: 1.1, greenCoverPercent: 36 },
      health: { heatStressIndex: 48, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 12, coolingDemandIncrease: 26 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "CWC", "Bhuvan"],
  },
  {
    id: "bihar",
    name: "Bihar",
    geoName: "Bihar",
    capital: "Patna",
    region: "east",
    coordinates: { lat: 25.6, lng: 85.13 },
    zone: "humid-subtropical",
    area: 94163,
    population: 124800000,
    current: { temperature: 25.6, rainfall: 1100, humidity: 64, windSpeed: 8, pressure: 1010, cloudCover: 44, uvIndex: 8, aqi: 168, soilMoisture: 42, groundwaterLevel: 8, snowCover: 0, evapotranspiration: 4.8 },
    monthly: {
      temperature: [15, 18, 24, 30, 35, 34, 30, 29, 29, 26, 20, 15],
      rainfall: [15, 12, 15, 10, 25, 100, 200, 250, 200, 80, 10, 5],
      humidity: hum(64), windSpeed: wind(8),
    },
    projections: proj(1.2, -2, 2.4, -6, 4.1, -11, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -18, irrigationDemand: 740, floodRisk: "extreme", droughtRisk: "high", mainCrops: ["Wheat", "Rice", "Maize", "Lentil"] },
      water: { riverBasin: "Ganga", annualFlow: 215, reservoirLevel: 48, floodPlainArea: 28600 },
      urban: { heatIslandIntensity: 3.2, urbanizationRate: 1.6, greenCoverPercent: 8 },
      health: { heatStressIndex: 74, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 11, coolingDemandIncrease: 52 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "CWC"],
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    geoName: "Chhattisgarh",
    capital: "Raipur",
    region: "central",
    coordinates: { lat: 21.28, lng: 81.87 },
    zone: "tropical",
    area: 135192,
    population: 29400000,
    current: { temperature: 27.1, rainfall: 1320, humidity: 60, windSpeed: 7, pressure: 1008, cloudCover: 48, uvIndex: 9, aqi: 102, soilMoisture: 48, groundwaterLevel: 9, snowCover: 0, evapotranspiration: 5.0 },
    monthly: {
      temperature: [20, 23, 28, 33, 37, 33, 28, 27, 27, 26, 22, 19],
      rainfall: [15, 10, 12, 8, 20, 150, 260, 300, 200, 50, 15, 8],
      humidity: hum(60), windSpeed: wind(7),
    },
    projections: proj(1.1, -1, 2.2, -4, 3.8, -8, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -12, irrigationDemand: 580, floodRisk: "medium", droughtRisk: "medium", mainCrops: ["Rice", "Maize", "Pulses"] },
      water: { riverBasin: "Mahanadi", annualFlow: 67, reservoirLevel: 64, floodPlainArea: 4800 },
      urban: { heatIslandIntensity: 2.1, urbanizationRate: 1.2, greenCoverPercent: 44 },
      health: { heatStressIndex: 60, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 19, coolingDemandIncrease: 36 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan"],
  },
  {
    id: "goa",
    name: "Goa",
    geoName: "Goa",
    capital: "Panaji",
    region: "west",
    coordinates: { lat: 15.3, lng: 74.12 },
    zone: "coastal",
    area: 3702,
    population: 1500000,
    current: { temperature: 27.3, rainfall: 2900, humidity: 78, windSpeed: 12, pressure: 1010, cloudCover: 62, uvIndex: 9, aqi: 58, soilMoisture: 58, groundwaterLevel: 6, snowCover: 0, evapotranspiration: 4.6 },
    monthly: {
      temperature: [24, 25, 27, 29, 31, 29, 27, 27, 27, 28, 27, 25],
      rainfall: [5, 3, 3, 10, 30, 700, 900, 700, 250, 80, 20, 5],
      humidity: hum(78), windSpeed: wind(12),
    },
    projections: proj(0.8, 5, 1.7, 9, 3.1, 14, 3),
    sectors: {
      agriculture: { cropYieldChange2050: -6, irrigationDemand: 280, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Coconut", "Cashew"] },
      water: { riverBasin: "Mandovi / Zuari", annualFlow: 9, reservoirLevel: 82, floodPlainArea: 420 },
      urban: { heatIslandIntensity: 1.6, urbanizationRate: 1.8, greenCoverPercent: 56 },
      health: { heatStressIndex: 42, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 4, coolingDemandIncrease: 28 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS"],
  },
  {
    id: "gujarat",
    name: "Gujarat",
    geoName: "Gujarat",
    capital: "Gandhinagar",
    region: "west",
    coordinates: { lat: 22.31, lng: 72.14 },
    zone: "arid",
    area: 196024,
    population: 70900000,
    current: { temperature: 27.8, rainfall: 700, humidity: 52, windSpeed: 13, pressure: 1011, cloudCover: 32, uvIndex: 10, aqi: 142, soilMoisture: 26, groundwaterLevel: 18, snowCover: 0, evapotranspiration: 6.1 },
    monthly: {
      temperature: [20, 22, 27, 32, 36, 35, 32, 30, 30, 28, 23, 19],
      rainfall: [5, 3, 3, 3, 8, 60, 150, 170, 90, 15, 5, 3],
      humidity: hum(52), windSpeed: wind(13),
    },
    projections: proj(1.3, -8, 2.6, -16, 4.2, -24, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -22, irrigationDemand: 1080, floodRisk: "medium", droughtRisk: "extreme", mainCrops: ["Cotton", "Groundnut", "Wheat", "Tobacco"] },
      water: { riverBasin: "Sabarmati / Narmada", annualFlow: 38, reservoirLevel: 52, floodPlainArea: 7200 },
      urban: { heatIslandIntensity: 3.6, urbanizationRate: 2.1, greenCoverPercent: 14 },
      health: { heatStressIndex: 78, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 142, coolingDemandIncrease: 58 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "GRACE-FO"],
  },
  {
    id: "haryana",
    name: "Haryana",
    geoName: "Haryana",
    capital: "Chandigarh",
    region: "north",
    coordinates: { lat: 29.06, lng: 76.09 },
    zone: "semi-arid",
    area: 44212,
    population: 28900000,
    current: { temperature: 24.8, rainfall: 600, humidity: 58, windSpeed: 9, pressure: 1011, cloudCover: 38, uvIndex: 8, aqi: 178, soilMoisture: 32, groundwaterLevel: 22, snowCover: 0, evapotranspiration: 5.4 },
    monthly: {
      temperature: [12, 15, 21, 28, 34, 36, 33, 32, 30, 26, 18, 12],
      rainfall: [30, 25, 20, 10, 15, 40, 90, 80, 50, 15, 5, 10],
      humidity: hum(58), windSpeed: wind(9),
    },
    projections: proj(1.4, -6, 2.7, -12, 4.4, -18, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -19, irrigationDemand: 1140, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Wheat", "Rice", "Sugarcane", "Mustard"] },
      water: { riverBasin: "Yamuna / Ghaggar", annualFlow: 14, reservoirLevel: 44, floodPlainArea: 2400 },
      urban: { heatIslandIntensity: 3.4, urbanizationRate: 2.0, greenCoverPercent: 7 },
      health: { heatStressIndex: 76, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 18, coolingDemandIncrease: 54 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "GRACE-FO"],
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    geoName: "Himachal Pradesh",
    capital: "Shimla",
    region: "north",
    coordinates: { lat: 31.1, lng: 77.17 },
    zone: "highland",
    area: 55673,
    population: 7300000,
    current: { temperature: 13.6, rainfall: 1550, humidity: 60, windSpeed: 7, pressure: 880, cloudCover: 52, uvIndex: 7, aqi: 52, soilMoisture: 54, groundwaterLevel: 6, snowCover: 35, evapotranspiration: 3.2 },
    monthly: {
      temperature: [4, 6, 11, 16, 21, 24, 24, 23, 19, 14, 8, 4],
      rainfall: [60, 70, 70, 40, 40, 80, 170, 180, 80, 30, 20, 50],
      humidity: hum(60), windSpeed: wind(7),
    },
    projections: proj(1.5, 2, 2.9, 5, 4.6, 9, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -10, irrigationDemand: 380, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Apple", "Wheat", "Maize", "Potato"] },
      water: { riverBasin: "Beas / Satluj", annualFlow: 79, reservoirLevel: 68, floodPlainArea: 1200 },
      urban: { heatIslandIntensity: 1.2, urbanizationRate: 0.9, greenCoverPercent: 68 },
      health: { heatStressIndex: 18, vectorDiseaseRisk: "low", airQualityTrend: "stable" },
      energy: { renewablePotential: 28, coolingDemandIncrease: 22 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "GRACE-FO"],
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    geoName: "Jharkhand",
    capital: "Ranchi",
    region: "east",
    coordinates: { lat: 23.61, lng: 85.28 },
    zone: "tropical",
    area: 79716,
    population: 38600000,
    current: { temperature: 26.4, rainfall: 1200, humidity: 62, windSpeed: 7, pressure: 1008, cloudCover: 42, uvIndex: 8, aqi: 134, soilMoisture: 44, groundwaterLevel: 10, snowCover: 0, evapotranspiration: 4.7 },
    monthly: {
      temperature: [16, 19, 25, 31, 36, 33, 28, 28, 28, 26, 20, 16],
      rainfall: [20, 25, 25, 20, 40, 150, 230, 270, 200, 60, 20, 10],
      humidity: hum(62), windSpeed: wind(7),
    },
    projections: proj(1.1, -3, 2.3, -7, 3.9, -12, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -14, irrigationDemand: 620, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Rice", "Maize", "Pulses"] },
      water: { riverBasin: "Damodar / Subarnarekha", annualFlow: 24, reservoirLevel: 54, floodPlainArea: 3100 },
      urban: { heatIslandIntensity: 2.4, urbanizationRate: 1.3, greenCoverPercent: 33 },
      health: { heatStressIndex: 62, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 18, coolingDemandIncrease: 42 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "CWC", "Bhuvan"],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    geoName: "Karnataka",
    capital: "Bengaluru",
    region: "south",
    coordinates: { lat: 14.6, lng: 75.71 },
    zone: "semi-arid",
    area: 191791,
    population: 67600000,
    current: { temperature: 24.2, rainfall: 1140, humidity: 64, windSpeed: 11, pressure: 1009, cloudCover: 50, uvIndex: 9, aqi: 88, soilMoisture: 40, groundwaterLevel: 14, snowCover: 0, evapotranspiration: 4.9 },
    monthly: {
      temperature: [21, 23, 26, 28, 29, 26, 24, 24, 24, 23, 21, 20],
      rainfall: [5, 8, 8, 30, 80, 90, 110, 130, 180, 190, 70, 15],
      humidity: hum(64), windSpeed: wind(11),
    },
    projections: proj(1.0, -4, 2.0, -9, 3.4, -14, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -15, irrigationDemand: 780, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Ragi", "Coffee", "Rice", "Sugarcane"] },
      water: { riverBasin: "Krishna / Cauvery", annualFlow: 98, reservoirLevel: 62, floodPlainArea: 5400 },
      urban: { heatIslandIntensity: 2.9, urbanizationRate: 2.4, greenCoverPercent: 21 },
      health: { heatStressIndex: 54, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 86, coolingDemandIncrease: 44 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "INCOIS"],
  },
  {
    id: "kerala",
    name: "Kerala",
    geoName: "Kerala",
    capital: "Thiruvananthapuram",
    region: "south",
    coordinates: { lat: 10.85, lng: 76.27 },
    zone: "coastal",
    area: 38863,
    population: 35700000,
    current: { temperature: 27.1, rainfall: 3000, humidity: 84, windSpeed: 12, pressure: 1010, cloudCover: 72, uvIndex: 10, aqi: 64, soilMoisture: 72, groundwaterLevel: 5, snowCover: 0, evapotranspiration: 4.4 },
    monthly: {
      temperature: [26, 27, 28, 29, 29, 27, 26, 26, 26, 27, 27, 26],
      rainfall: [30, 25, 50, 120, 250, 650, 600, 400, 280, 340, 150, 50],
      humidity: hum(84), windSpeed: wind(12),
    },
    projections: proj(0.9, 5, 1.8, 11, 3.2, 18, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -9, irrigationDemand: 360, floodRisk: "extreme", droughtRisk: "low", mainCrops: ["Rice", "Rubber", "Coconut", "Tea"] },
      water: { riverBasin: "Periyar / Bharathapuzha", annualFlow: 78, reservoirLevel: 78, floodPlainArea: 4900 },
      urban: { heatIslandIntensity: 1.8, urbanizationRate: 1.7, greenCoverPercent: 52 },
      health: { heatStressIndex: 48, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 32, coolingDemandIncrease: 32 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "CWC"],
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    geoName: "Madhya Pradesh",
    capital: "Bhopal",
    region: "central",
    coordinates: { lat: 23.47, lng: 77.95 },
    zone: "semi-arid",
    area: 308252,
    population: 85400000,
    current: { temperature: 26.3, rainfall: 1160, humidity: 56, windSpeed: 8, pressure: 1006, cloudCover: 42, uvIndex: 9, aqi: 124, soilMoisture: 38, groundwaterLevel: 14, snowCover: 0, evapotranspiration: 5.3 },
    monthly: {
      temperature: [16, 19, 25, 31, 37, 34, 28, 27, 27, 25, 19, 16],
      rainfall: [15, 12, 12, 8, 15, 120, 210, 250, 180, 40, 15, 8],
      humidity: hum(56), windSpeed: wind(8),
    },
    projections: proj(1.2, -4, 2.3, -9, 4.0, -15, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -17, irrigationDemand: 820, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Soybean", "Wheat", "Pulses"] },
      water: { riverBasin: "Narmada / Chambal", annualFlow: 81, reservoirLevel: 56, floodPlainArea: 8200 },
      urban: { heatIslandIntensity: 2.6, urbanizationRate: 1.5, greenCoverPercent: 25 },
      health: { heatStressIndex: 64, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 92, coolingDemandIncrease: 46 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "CWC"],
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    geoName: "Maharashtra",
    capital: "Mumbai",
    region: "west",
    coordinates: { lat: 19.6, lng: 75.55 },
    zone: "coastal",
    area: 307713,
    population: 126400000,
    current: { temperature: 26.8, rainfall: 1350, humidity: 64, windSpeed: 11, pressure: 1009, cloudCover: 48, uvIndex: 9, aqi: 116, soilMoisture: 38, groundwaterLevel: 13, snowCover: 0, evapotranspiration: 5.2 },
    monthly: {
      temperature: [22, 24, 27, 30, 32, 30, 27, 27, 27, 27, 24, 22],
      rainfall: [3, 3, 5, 10, 20, 150, 300, 290, 180, 60, 15, 5],
      humidity: hum(64), windSpeed: wind(11),
    },
    projections: proj(1.1, -3, 2.2, -8, 3.7, -13, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -16, irrigationDemand: 880, floodRisk: "high", droughtRisk: "high", mainCrops: ["Sugarcane", "Cotton", "Soybean", "Onion"] },
      water: { riverBasin: "Godavari / Krishna", annualFlow: 164, reservoirLevel: 60, floodPlainArea: 9800 },
      urban: { heatIslandIntensity: 3.4, urbanizationRate: 2.3, greenCoverPercent: 17 },
      health: { heatStressIndex: 66, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 98, coolingDemandIncrease: 48 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "CWC"],
  },
  {
    id: "manipur",
    name: "Manipur",
    geoName: "Manipur",
    capital: "Imphal",
    region: "northeast",
    coordinates: { lat: 24.66, lng: 93.91 },
    zone: "highland",
    area: 22327,
    population: 3000000,
    current: { temperature: 20.4, rainfall: 1470, humidity: 72, windSpeed: 6, pressure: 970, cloudCover: 56, uvIndex: 6, aqi: 56, soilMoisture: 58, groundwaterLevel: 5, snowCover: 0, evapotranspiration: 3.6 },
    monthly: {
      temperature: [9, 12, 18, 23, 26, 27, 27, 27, 25, 21, 15, 10],
      rainfall: [20, 25, 55, 90, 150, 250, 280, 260, 200, 80, 25, 15],
      humidity: hum(72), windSpeed: wind(6),
    },
    projections: proj(1.0, 3, 2.0, 6, 3.5, 11, 3),
    sectors: {
      agriculture: { cropYieldChange2050: -10, irrigationDemand: 360, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Maize", "Pineapple"] },
      water: { riverBasin: "Barak / Loktak", annualFlow: 18, reservoirLevel: 72, floodPlainArea: 900 },
      urban: { heatIslandIntensity: 1.2, urbanizationRate: 0.8, greenCoverPercent: 74 },
      health: { heatStressIndex: 34, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 8, coolingDemandIncrease: 22 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan"],
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    geoName: "Meghalaya",
    capital: "Shillong",
    region: "northeast",
    coordinates: { lat: 25.46, lng: 91.36 },
    zone: "monsoon",
    area: 22429,
    population: 3400000,
    current: { temperature: 17.8, rainfall: 5000, humidity: 86, windSpeed: 7, pressure: 920, cloudCover: 78, uvIndex: 6, aqi: 42, soilMoisture: 82, groundwaterLevel: 3, snowCover: 0, evapotranspiration: 3.4 },
    monthly: {
      temperature: [10, 12, 16, 20, 22, 23, 23, 23, 22, 19, 14, 10],
      rainfall: [30, 50, 200, 500, 900, 1300, 1100, 700, 400, 150, 30, 20],
      humidity: hum(86), windSpeed: wind(7),
    },
    projections: proj(1.0, 4, 2.0, 8, 3.4, 13, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -7, irrigationDemand: 240, floodRisk: "extreme", droughtRisk: "low", mainCrops: ["Rice", "Maize", "Turmeric"] },
      water: { riverBasin: "Brahmaputra tributaries", annualFlow: 62, reservoirLevel: 88, floodPlainArea: 1100 },
      urban: { heatIslandIntensity: 1.0, urbanizationRate: 0.7, greenCoverPercent: 76 },
      health: { heatStressIndex: 24, vectorDiseaseRisk: "medium", airQualityTrend: "improving" },
      energy: { renewablePotential: 9, coolingDemandIncrease: 18 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan"],
  },
  {
    id: "mizoram",
    name: "Mizoram",
    geoName: "Mizoram",
    capital: "Aizawl",
    region: "northeast",
    coordinates: { lat: 23.16, lng: 92.94 },
    zone: "highland",
    area: 21081,
    population: 1200000,
    current: { temperature: 21.2, rainfall: 2500, humidity: 78, windSpeed: 6, pressure: 960, cloudCover: 64, uvIndex: 6, aqi: 44, soilMoisture: 70, groundwaterLevel: 5, snowCover: 0, evapotranspiration: 3.8 },
    monthly: {
      temperature: [12, 14, 19, 23, 25, 26, 26, 26, 24, 21, 16, 12],
      rainfall: [20, 30, 80, 180, 280, 400, 380, 320, 240, 100, 30, 20],
      humidity: hum(78), windSpeed: wind(6),
    },
    projections: proj(1.0, 3, 2.0, 7, 3.4, 12, 3),
    sectors: {
      agriculture: { cropYieldChange2050: -8, irrigationDemand: 280, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Maize", "Ginger"] },
      water: { riverBasin: "Tlawng / Kolodyne", annualFlow: 14, reservoirLevel: 82, floodPlainArea: 600 },
      urban: { heatIslandIntensity: 1.0, urbanizationRate: 0.7, greenCoverPercent: 79 },
      health: { heatStressIndex: 28, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 6, coolingDemandIncrease: 18 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD"],
  },
  {
    id: "nagaland",
    name: "Nagaland",
    geoName: "Nagaland",
    capital: "Kohima",
    region: "northeast",
    coordinates: { lat: 26.16, lng: 94.56 },
    zone: "highland",
    area: 16579,
    population: 2200000,
    current: { temperature: 19.6, rainfall: 1800, humidity: 76, windSpeed: 6, pressure: 940, cloudCover: 60, uvIndex: 6, aqi: 48, soilMoisture: 64, groundwaterLevel: 5, snowCover: 0, evapotranspiration: 3.7 },
    monthly: {
      temperature: [8, 11, 17, 22, 25, 26, 26, 26, 24, 20, 14, 9],
      rainfall: [20, 30, 80, 130, 180, 280, 320, 280, 220, 80, 30, 20],
      humidity: hum(76), windSpeed: wind(6),
    },
    projections: proj(1.0, 3, 2.0, 6, 3.4, 11, 3),
    sectors: {
      agriculture: { cropYieldChange2050: -9, irrigationDemand: 280, floodRisk: "medium", droughtRisk: "low", mainCrops: ["Rice", "Maize", "Pineapple"] },
      water: { riverBasin: "Doyang / Dikhu", annualFlow: 11, reservoirLevel: 76, floodPlainArea: 500 },
      urban: { heatIslandIntensity: 1.0, urbanizationRate: 0.7, greenCoverPercent: 75 },
      health: { heatStressIndex: 30, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 5, coolingDemandIncrease: 18 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD"],
  },
  {
    id: "odisha",
    name: "Odisha",
    geoName: "Orissa",
    capital: "Bhubaneswar",
    region: "east",
    coordinates: { lat: 20.95, lng: 85.1 },
    zone: "coastal",
    area: 155707,
    population: 47100000,
    current: { temperature: 27.4, rainfall: 1500, humidity: 72, windSpeed: 13, pressure: 1009, cloudCover: 54, uvIndex: 9, aqi: 92, soilMoisture: 52, groundwaterLevel: 8, snowCover: 0, evapotranspiration: 4.8 },
    monthly: {
      temperature: [20, 23, 28, 32, 36, 33, 29, 28, 28, 27, 23, 20],
      rainfall: [15, 20, 25, 25, 50, 150, 280, 320, 240, 120, 30, 10],
      humidity: hum(72), windSpeed: wind(13),
    },
    projections: proj(1.1, -2, 2.2, -5, 3.7, -9, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -16, irrigationDemand: 740, floodRisk: "extreme", droughtRisk: "medium", mainCrops: ["Rice", "Pulses", "Oilseeds"] },
      water: { riverBasin: "Mahanadi", annualFlow: 67, reservoirLevel: 64, floodPlainArea: 14200 },
      urban: { heatIslandIntensity: 2.4, urbanizationRate: 1.4, greenCoverPercent: 33 },
      health: { heatStressIndex: 62, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 36, coolingDemandIncrease: 38 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "CWC"],
  },
  {
    id: "punjab",
    name: "Punjab",
    geoName: "Punjab",
    capital: "Chandigarh",
    region: "north",
    coordinates: { lat: 31.15, lng: 75.34 },
    zone: "semi-arid",
    area: 50362,
    population: 30100000,
    current: { temperature: 23.4, rainfall: 620, humidity: 60, windSpeed: 8, pressure: 1011, cloudCover: 40, uvIndex: 8, aqi: 164, soilMoisture: 36, groundwaterLevel: 28, snowCover: 0, evapotranspiration: 5.3 },
    monthly: {
      temperature: [10, 13, 19, 27, 33, 36, 33, 32, 30, 24, 16, 11],
      rainfall: [35, 30, 25, 15, 20, 35, 80, 75, 40, 10, 5, 20],
      humidity: hum(60), windSpeed: wind(8),
    },
    projections: proj(1.4, -7, 2.7, -13, 4.4, -20, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -21, irrigationDemand: 1240, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Wheat", "Rice", "Cotton"] },
      water: { riverBasin: "Indus tributaries", annualFlow: 49, reservoirLevel: 42, floodPlainArea: 3400 },
      urban: { heatIslandIntensity: 3.0, urbanizationRate: 1.8, greenCoverPercent: 6 },
      health: { heatStressIndex: 68, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 12, coolingDemandIncrease: 52 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "GRACE-FO", "CWC"],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    geoName: "Rajasthan",
    capital: "Jaipur",
    region: "north",
    coordinates: { lat: 26.91, lng: 73.72 },
    zone: "arid",
    area: 342239,
    population: 81000000,
    current: { temperature: 28.7, rainfall: 360, humidity: 42, windSpeed: 14, pressure: 1007, cloudCover: 22, uvIndex: 11, aqi: 156, soilMoisture: 14, groundwaterLevel: 32, snowCover: 0, evapotranspiration: 7.2 },
    monthly: {
      temperature: [16, 19, 25, 32, 38, 39, 36, 34, 33, 28, 22, 17],
      rainfall: [8, 6, 4, 4, 8, 20, 70, 80, 60, 15, 5, 3],
      humidity: hum(42), windSpeed: wind(14),
    },
    projections: proj(1.6, -10, 3.1, -19, 4.9, -28, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -26, irrigationDemand: 1320, floodRisk: "low", droughtRisk: "extreme", mainCrops: ["Bajra", "Wheat", "Mustard", "Pulses"] },
      water: { riverBasin: "Luni / Chambal", annualFlow: 18, reservoirLevel: 38, floodPlainArea: 4200 },
      urban: { heatIslandIntensity: 3.8, urbanizationRate: 1.9, greenCoverPercent: 6 },
      health: { heatStressIndex: 84, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 142, coolingDemandIncrease: 62 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "GRACE-FO", "Bhuvan"],
  },
  {
    id: "sikkim",
    name: "Sikkim",
    geoName: "Sikkim",
    capital: "Gangtok",
    region: "northeast",
    coordinates: { lat: 27.53, lng: 88.51 },
    zone: "alpine",
    area: 7096,
    population: 690000,
    current: { temperature: 12.4, rainfall: 2500, humidity: 74, windSpeed: 9, pressure: 800, cloudCover: 68, uvIndex: 7, aqi: 36, soilMoisture: 60, groundwaterLevel: 4, snowCover: 60, evapotranspiration: 2.8 },
    monthly: {
      temperature: [4, 6, 10, 14, 17, 18, 19, 19, 17, 14, 8, 4],
      rainfall: [30, 45, 70, 120, 160, 380, 480, 420, 280, 120, 40, 20],
      humidity: hum(74), windSpeed: wind(9),
    },
    projections: proj(1.6, 3, 3.0, 7, 4.7, 12, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -8, irrigationDemand: 280, floodRisk: "high", droughtRisk: "low", mainCrops: ["Cardamom", "Maize", "Ginger"] },
      water: { riverBasin: "Teesta", annualFlow: 36, reservoirLevel: 84, floodPlainArea: 300 },
      urban: { heatIslandIntensity: 1.0, urbanizationRate: 1.0, greenCoverPercent: 47 },
      health: { heatStressIndex: 16, vectorDiseaseRisk: "low", airQualityTrend: "stable" },
      energy: { renewablePotential: 8, coolingDemandIncrease: 18 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "GRACE-FO"],
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    geoName: "Tamil Nadu",
    capital: "Chennai",
    region: "south",
    coordinates: { lat: 11.13, lng: 78.66 },
    zone: "coastal",
    area: 130060,
    population: 77800000,
    current: { temperature: 28.6, rainfall: 970, humidity: 70, windSpeed: 13, pressure: 1009, cloudCover: 52, uvIndex: 10, aqi: 102, soilMoisture: 38, groundwaterLevel: 16, snowCover: 0, evapotranspiration: 5.4 },
    monthly: {
      temperature: [24, 25, 27, 30, 33, 32, 30, 29, 29, 28, 26, 24],
      rainfall: [35, 25, 15, 20, 40, 50, 90, 130, 130, 280, 290, 130],
      humidity: hum(70), windSpeed: wind(13),
    },
    projections: proj(1.0, -3, 2.0, -7, 3.4, -12, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -15, irrigationDemand: 880, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Rice", "Sugarcane", "Cotton", "Pulses"] },
      water: { riverBasin: "Cauvery / Palar", annualFlow: 24, reservoirLevel: 56, floodPlainArea: 6200 },
      urban: { heatIslandIntensity: 3.2, urbanizationRate: 2.1, greenCoverPercent: 19 },
      health: { heatStressIndex: 70, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 78, coolingDemandIncrease: 48 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "CWC"],
  },
  {
    id: "telangana",
    name: "Telangana",
    geoName: "Andhra Pradesh", // not in old geojson; falls back to AP cluster visually
    capital: "Hyderabad",
    region: "south",
    coordinates: { lat: 18.11, lng: 79.02 },
    zone: "semi-arid",
    area: 112077,
    population: 38500000,
    current: { temperature: 28.9, rainfall: 900, humidity: 56, windSpeed: 10, pressure: 1008, cloudCover: 38, uvIndex: 9, aqi: 118, soilMoisture: 32, groundwaterLevel: 18, snowCover: 0, evapotranspiration: 5.6 },
    monthly: {
      temperature: [22, 25, 30, 34, 38, 35, 29, 28, 28, 27, 23, 21],
      rainfall: [8, 8, 10, 15, 20, 130, 220, 240, 180, 70, 18, 5],
      humidity: hum(56), windSpeed: wind(10),
    },
    projections: proj(1.2, -5, 2.4, -10, 4.0, -16, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -18, irrigationDemand: 940, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Cotton", "Rice", "Maize"] },
      water: { riverBasin: "Krishna / Godavari", annualFlow: 76, reservoirLevel: 52, floodPlainArea: 5200 },
      urban: { heatIslandIntensity: 3.4, urbanizationRate: 2.2, greenCoverPercent: 24 },
      health: { heatStressIndex: 72, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 42, coolingDemandIncrease: 54 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "GRACE-FO"],
  },
  {
    id: "tripura",
    name: "Tripura",
    geoName: "Tripura",
    capital: "Agartala",
    region: "northeast",
    coordinates: { lat: 23.74, lng: 91.75 },
    zone: "monsoon",
    area: 10486,
    population: 4100000,
    current: { temperature: 25.1, rainfall: 2100, humidity: 80, windSpeed: 6, pressure: 1004, cloudCover: 64, uvIndex: 7, aqi: 62, soilMoisture: 68, groundwaterLevel: 4, snowCover: 0, evapotranspiration: 4.0 },
    monthly: {
      temperature: [17, 19, 23, 27, 28, 29, 29, 29, 28, 26, 21, 17],
      rainfall: [10, 25, 60, 200, 320, 380, 380, 340, 260, 110, 25, 10],
      humidity: hum(80), windSpeed: wind(6),
    },
    projections: proj(1.0, 4, 2.0, 8, 3.5, 13, 3),
    sectors: {
      agriculture: { cropYieldChange2050: -10, irrigationDemand: 340, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Jute", "Tea"] },
      water: { riverBasin: "Gomati / Haora", annualFlow: 12, reservoirLevel: 78, floodPlainArea: 700 },
      urban: { heatIslandIntensity: 1.2, urbanizationRate: 1.0, greenCoverPercent: 72 },
      health: { heatStressIndex: 38, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 4, coolingDemandIncrease: 22 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD"],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    geoName: "Uttaranchal",
    capital: "Dehradun",
    region: "north",
    coordinates: { lat: 30.07, lng: 79.02 },
    zone: "highland",
    area: 53483,
    population: 11400000,
    current: { temperature: 14.8, rainfall: 1600, humidity: 64, windSpeed: 7, pressure: 880, cloudCover: 54, uvIndex: 7, aqi: 68, soilMoisture: 56, groundwaterLevel: 7, snowCover: 40, evapotranspiration: 3.4 },
    monthly: {
      temperature: [6, 8, 13, 18, 22, 24, 24, 23, 20, 15, 10, 6],
      rainfall: [50, 60, 70, 50, 60, 140, 320, 340, 180, 50, 20, 40],
      humidity: hum(64), windSpeed: wind(7),
    },
    projections: proj(1.5, 2, 2.9, 5, 4.6, 9, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -11, irrigationDemand: 420, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Wheat", "Rice", "Apple"] },
      water: { riverBasin: "Ganga / Yamuna headwaters", annualFlow: 124, reservoirLevel: 64, floodPlainArea: 1800 },
      urban: { heatIslandIntensity: 1.4, urbanizationRate: 1.1, greenCoverPercent: 66 },
      health: { heatStressIndex: 22, vectorDiseaseRisk: "low", airQualityTrend: "stable" },
      energy: { renewablePotential: 24, coolingDemandIncrease: 24 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "GRACE-FO"],
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    geoName: "Uttar Pradesh",
    capital: "Lucknow",
    region: "north",
    coordinates: { lat: 26.85, lng: 80.95 },
    zone: "humid-subtropical",
    area: 240928,
    population: 235700000,
    current: { temperature: 25.8, rainfall: 900, humidity: 60, windSpeed: 8, pressure: 1010, cloudCover: 40, uvIndex: 8, aqi: 184, soilMoisture: 36, groundwaterLevel: 14, snowCover: 0, evapotranspiration: 5.1 },
    monthly: {
      temperature: [14, 17, 23, 30, 35, 35, 31, 30, 30, 26, 20, 14],
      rainfall: [18, 15, 12, 8, 18, 90, 220, 240, 180, 40, 10, 5],
      humidity: hum(60), windSpeed: wind(8),
    },
    projections: proj(1.3, -4, 2.5, -8, 4.2, -13, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -18, irrigationDemand: 1020, floodRisk: "high", droughtRisk: "high", mainCrops: ["Wheat", "Rice", "Sugarcane"] },
      water: { riverBasin: "Ganga / Yamuna", annualFlow: 254, reservoirLevel: 52, floodPlainArea: 24800 },
      urban: { heatIslandIntensity: 3.4, urbanizationRate: 1.7, greenCoverPercent: 9 },
      health: { heatStressIndex: 76, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 52, coolingDemandIncrease: 56 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "CWC", "GRACE-FO"],
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    geoName: "West Bengal",
    capital: "Kolkata",
    region: "east",
    coordinates: { lat: 22.99, lng: 87.85 },
    zone: "tropical",
    area: 88752,
    population: 99600000,
    current: { temperature: 26.4, rainfall: 1750, humidity: 76, windSpeed: 11, pressure: 1008, cloudCover: 58, uvIndex: 9, aqi: 132, soilMoisture: 56, groundwaterLevel: 7, snowCover: 0, evapotranspiration: 4.8 },
    monthly: {
      temperature: [18, 22, 27, 31, 32, 31, 29, 29, 29, 27, 23, 19],
      rainfall: [15, 25, 35, 50, 120, 280, 360, 320, 250, 130, 20, 5],
      humidity: hum(76), windSpeed: wind(11),
    },
    projections: proj(1.1, -2, 2.2, -5, 3.7, -9, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -15, irrigationDemand: 780, floodRisk: "extreme", droughtRisk: "medium", mainCrops: ["Rice", "Jute", "Tea", "Potato"] },
      water: { riverBasin: "Ganga / Hooghly", annualFlow: 138, reservoirLevel: 58, floodPlainArea: 22400 },
      urban: { heatIslandIntensity: 3.4, urbanizationRate: 1.9, greenCoverPercent: 18 },
      health: { heatStressIndex: 68, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 22, coolingDemandIncrease: 46 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "INCOIS", "CWC"],
  },
  // Union Territories
  {
    id: "andaman-nicobar",
    name: "Andaman & Nicobar Islands",
    geoName: "Andaman and Nicobar",
    capital: "Port Blair",
    region: "ut",
    coordinates: { lat: 11.74, lng: 92.66 },
    zone: "coastal",
    area: 8249,
    population: 400000,
    current: { temperature: 26.8, rainfall: 3180, humidity: 82, windSpeed: 14, pressure: 1010, cloudCover: 72, uvIndex: 10, aqi: 32, soilMoisture: 78, groundwaterLevel: 4, snowCover: 0, evapotranspiration: 4.5 },
    monthly: {
      temperature: [25, 26, 27, 29, 29, 28, 27, 27, 27, 27, 27, 26],
      rainfall: [40, 30, 30, 70, 350, 450, 410, 410, 460, 290, 250, 200],
      humidity: hum(82), windSpeed: wind(14),
    },
    projections: proj(0.9, 6, 1.8, 12, 3.2, 19, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -8, irrigationDemand: 200, floodRisk: "extreme", droughtRisk: "low", mainCrops: ["Coconut", "Rice", "Spices"] },
      water: { riverBasin: "Island catchments", annualFlow: 8, reservoirLevel: 82, floodPlainArea: 400 },
      urban: { heatIslandIntensity: 1.2, urbanizationRate: 1.2, greenCoverPercent: 81 },
      health: { heatStressIndex: 36, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 2, coolingDemandIncrease: 28 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "INCOIS", "IMD"],
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    geoName: "Chandigarh",
    capital: "Chandigarh",
    region: "ut",
    coordinates: { lat: 30.74, lng: 76.78 },
    zone: "humid-subtropical",
    area: 114,
    population: 1200000,
    current: { temperature: 23.2, rainfall: 1110, humidity: 58, windSpeed: 7, pressure: 1010, cloudCover: 42, uvIndex: 8, aqi: 138, soilMoisture: 40, groundwaterLevel: 18, snowCover: 0, evapotranspiration: 4.8 },
    monthly: {
      temperature: [12, 15, 20, 27, 33, 35, 31, 30, 29, 25, 18, 13],
      rainfall: [45, 40, 35, 25, 30, 120, 280, 280, 130, 25, 10, 25],
      humidity: hum(58), windSpeed: wind(7),
    },
    projections: proj(1.4, -3, 2.7, -7, 4.4, -12, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -14, irrigationDemand: 480, floodRisk: "low", droughtRisk: "medium", mainCrops: ["Wheat", "Vegetables"] },
      water: { riverBasin: "Sukhna / Ghaggar", annualFlow: 1, reservoirLevel: 56, floodPlainArea: 20 },
      urban: { heatIslandIntensity: 3.6, urbanizationRate: 1.4, greenCoverPercent: 46 },
      health: { heatStressIndex: 60, vectorDiseaseRisk: "medium", airQualityTrend: "worsening" },
      energy: { renewablePotential: 0.4, coolingDemandIncrease: 48 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["IMD", "INSAT-3DR"],
  },
  {
    id: "dadra-nagar-haveli",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    geoName: "Dadra and Nagar Haveli",
    capital: "Daman",
    region: "ut",
    coordinates: { lat: 20.27, lng: 73.02 },
    zone: "coastal",
    area: 603,
    population: 600000,
    current: { temperature: 28.4, rainfall: 1500, humidity: 72, windSpeed: 11, pressure: 1010, cloudCover: 52, uvIndex: 10, aqi: 76, soilMoisture: 54, groundwaterLevel: 8, snowCover: 0, evapotranspiration: 5.1 },
    monthly: {
      temperature: [24, 25, 28, 30, 32, 30, 28, 28, 28, 29, 27, 25],
      rainfall: [3, 2, 2, 5, 20, 380, 480, 320, 220, 60, 10, 3],
      humidity: hum(72), windSpeed: wind(11),
    },
    projections: proj(1.0, -2, 2.0, -5, 3.5, -9, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -10, irrigationDemand: 320, floodRisk: "high", droughtRisk: "low", mainCrops: ["Rice", "Pulses"] },
      water: { riverBasin: "Daman Ganga", annualFlow: 3, reservoirLevel: 72, floodPlainArea: 80 },
      urban: { heatIslandIntensity: 2.0, urbanizationRate: 1.8, greenCoverPercent: 42 },
      health: { heatStressIndex: 52, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 0.6, coolingDemandIncrease: 38 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["IMD", "INSAT-3DR", "INCOIS"],
  },
  {
    id: "delhi",
    name: "Delhi",
    geoName: "Delhi",
    capital: "New Delhi",
    region: "ut",
    coordinates: { lat: 28.61, lng: 77.21 },
    zone: "semi-arid",
    area: 1484,
    population: 33800000,
    current: { temperature: 25.1, rainfall: 614, humidity: 56, windSpeed: 9, pressure: 1010, cloudCover: 36, uvIndex: 9, aqi: 218, soilMoisture: 28, groundwaterLevel: 26, snowCover: 0, evapotranspiration: 5.4 },
    monthly: {
      temperature: [13, 16, 22, 29, 34, 35, 31, 30, 29, 25, 18, 13],
      rainfall: [22, 18, 16, 10, 15, 60, 220, 230, 110, 15, 5, 8],
      humidity: hum(56), windSpeed: wind(9),
    },
    projections: proj(1.5, -5, 2.9, -10, 4.6, -16, 7),
    sectors: {
      agriculture: { cropYieldChange2050: -22, irrigationDemand: 980, floodRisk: "medium", droughtRisk: "high", mainCrops: ["Wheat", "Vegetables"] },
      water: { riverBasin: "Yamuna", annualFlow: 12, reservoirLevel: 38, floodPlainArea: 280 },
      urban: { heatIslandIntensity: 4.4, urbanizationRate: 1.4, greenCoverPercent: 21 },
      health: { heatStressIndex: 86, vectorDiseaseRisk: "high", airQualityTrend: "worsening" },
      energy: { renewablePotential: 2.5, coolingDemandIncrease: 64 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["IMD", "INSAT-3DR", "CWC"],
  },
  {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    geoName: "Jammu and Kashmir",
    capital: "Srinagar",
    region: "ut",
    coordinates: { lat: 33.78, lng: 76.57 },
    zone: "alpine",
    area: 222236,
    population: 13600000,
    current: { temperature: 12.2, rainfall: 650, humidity: 62, windSpeed: 8, pressure: 850, cloudCover: 48, uvIndex: 7, aqi: 84, soilMoisture: 48, groundwaterLevel: 6, snowCover: 50, evapotranspiration: 3.1 },
    monthly: {
      temperature: [2, 5, 10, 16, 20, 24, 26, 25, 21, 15, 9, 3],
      rainfall: [70, 80, 110, 90, 60, 35, 60, 70, 30, 25, 15, 50],
      humidity: hum(62), windSpeed: wind(8),
    },
    projections: proj(1.6, 0, 3.1, 1, 4.8, 4, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -10, irrigationDemand: 380, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Apple", "Saffron", "Rice"] },
      water: { riverBasin: "Indus / Jhelum", annualFlow: 87, reservoirLevel: 64, floodPlainArea: 4800 },
      urban: { heatIslandIntensity: 1.6, urbanizationRate: 1.0, greenCoverPercent: 39 },
      health: { heatStressIndex: 20, vectorDiseaseRisk: "low", airQualityTrend: "stable" },
      energy: { renewablePotential: 22, coolingDemandIncrease: 26 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "Bhuvan", "GRACE-FO"],
  },
  {
    id: "ladakh",
    name: "Ladakh",
    geoName: "Jammu and Kashmir",
    capital: "Leh",
    region: "ut",
    coordinates: { lat: 34.15, lng: 77.58 },
    zone: "alpine",
    area: 59146,
    population: 290000,
    current: { temperature: 3.8, rainfall: 100, humidity: 38, windSpeed: 12, pressure: 720, cloudCover: 26, uvIndex: 10, aqi: 28, soilMoisture: 14, groundwaterLevel: 4, snowCover: 70, evapotranspiration: 2.1 },
    monthly: {
      temperature: [-8, -5, 1, 7, 11, 16, 18, 17, 13, 6, -1, -6],
      rainfall: [10, 8, 12, 10, 8, 5, 18, 22, 6, 2, 2, 4],
      humidity: hum(38), windSpeed: wind(12),
    },
    projections: proj(1.8, 5, 3.4, 11, 5.2, 18, 4),
    sectors: {
      agriculture: { cropYieldChange2050: -6, irrigationDemand: 220, floodRisk: "medium", droughtRisk: "medium", mainCrops: ["Barley", "Apricot"] },
      water: { riverBasin: "Indus", annualFlow: 38, reservoirLevel: 60, floodPlainArea: 600 },
      urban: { heatIslandIntensity: 0.8, urbanizationRate: 0.8, greenCoverPercent: 4 },
      health: { heatStressIndex: 10, vectorDiseaseRisk: "low", airQualityTrend: "stable" },
      energy: { renewablePotential: 38, coolingDemandIncrease: 14 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INSAT-3DR", "IMD", "GRACE-FO", "Bhuvan"],
  },
  {
    id: "lakshadweep",
    name: "Lakshadweep",
    geoName: "Lakshadweep",
    capital: "Kavaratti",
    region: "ut",
    coordinates: { lat: 10.57, lng: 72.64 },
    zone: "coastal",
    area: 32,
    population: 65000,
    current: { temperature: 28.4, rainfall: 1600, humidity: 80, windSpeed: 13, pressure: 1010, cloudCover: 60, uvIndex: 11, aqi: 28, soilMoisture: 64, groundwaterLevel: 3, snowCover: 0, evapotranspiration: 4.6 },
    monthly: {
      temperature: [27, 27, 28, 29, 29, 28, 27, 27, 27, 28, 28, 27],
      rainfall: [30, 15, 10, 50, 160, 320, 280, 230, 180, 140, 110, 60],
      humidity: hum(80), windSpeed: wind(13),
    },
    projections: proj(0.9, 4, 1.8, 9, 3.2, 15, 6),
    sectors: {
      agriculture: { cropYieldChange2050: -6, irrigationDemand: 140, floodRisk: "extreme", droughtRisk: "low", mainCrops: ["Coconut"] },
      water: { riverBasin: "Atoll lens", annualFlow: 0.1, reservoirLevel: 60, floodPlainArea: 10 },
      urban: { heatIslandIntensity: 0.8, urbanizationRate: 1.0, greenCoverPercent: 60 },
      health: { heatStressIndex: 40, vectorDiseaseRisk: "medium", airQualityTrend: "stable" },
      energy: { renewablePotential: 0.6, coolingDemandIncrease: 30 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["INCOIS", "INSAT-3DR", "IMD"],
  },
  {
    id: "puducherry",
    name: "Puducherry",
    geoName: "Puducherry",
    capital: "Puducherry",
    region: "ut",
    coordinates: { lat: 11.94, lng: 79.81 },
    zone: "coastal",
    area: 479,
    population: 1700000,
    current: { temperature: 28.8, rainfall: 1200, humidity: 76, windSpeed: 12, pressure: 1010, cloudCover: 54, uvIndex: 10, aqi: 78, soilMoisture: 48, groundwaterLevel: 10, snowCover: 0, evapotranspiration: 5.0 },
    monthly: {
      temperature: [25, 26, 28, 31, 33, 32, 31, 30, 29, 28, 27, 25],
      rainfall: [25, 12, 15, 25, 50, 60, 100, 140, 130, 280, 280, 90],
      humidity: hum(76), windSpeed: wind(12),
    },
    projections: proj(1.0, -3, 2.0, -7, 3.4, -12, 5),
    sectors: {
      agriculture: { cropYieldChange2050: -13, irrigationDemand: 620, floodRisk: "high", droughtRisk: "medium", mainCrops: ["Rice", "Pulses", "Sugarcane"] },
      water: { riverBasin: "Coastal streams", annualFlow: 1, reservoirLevel: 60, floodPlainArea: 110 },
      urban: { heatIslandIntensity: 2.4, urbanizationRate: 1.8, greenCoverPercent: 28 },
      health: { heatStressIndex: 64, vectorDiseaseRisk: "high", airQualityTrend: "stable" },
      energy: { renewablePotential: 1.2, coolingDemandIncrease: 42 },
    },
    extremeEvents: [], alerts: [],
    dataSources: ["IMD", "INCOIS", "INSAT-3DR"],
  },
];

export const REGIONS: Record<Region, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  northeast: "Northeast",
  central: "Central",
  ut: "Union Territories",
};

export const ZONE_COLORS: Record<ClimateZone, string> = {
  tropical: "#00d4aa",
  arid: "#e0a83a",
  "semi-arid": "#d68a3a",
  "humid-subtropical": "#5ec1c7",
  highland: "#7a8fc9",
  coastal: "#00f5ff",
  monsoon: "#4f8df8",
  alpine: "#a8b8d8",
};

export function getStateById(id: string): StateClimateData | null {
  return CLIMATE_DATA.find((s) => s.id === id) ?? null;
}

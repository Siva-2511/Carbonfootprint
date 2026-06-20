// ─────────────────────────────────────────────────────────
//  config.ts — Frozen IPCC emission factors & app constants
// ─────────────────────────────────────────────────────────

export const EMISSION_FACTORS = Object.freeze({
  electricity: {
    grid: 0.42,    // kg CO₂e/kWh — India grid average
    solar: 0.04,   // kg CO₂e/kWh — lifecycle solar
    mixed: 0.23,   // kg CO₂e/kWh — 50/50 grid+solar
  },
  heating: {
    naturalGas: 5.3, // kg CO₂e/therm
  },
  transport: {
    petrol: 0.21,    // kg CO₂e/km
    diesel: 0.27,    // kg CO₂e/km
    ev: 0.05,        // kg CO₂e/km — EV on India grid
    none: 0,
    bus: 0.08,       // kg CO₂e/km
    metro: 0.03,     // kg CO₂e/km
    twoWheeler: 0.10,// kg CO₂e/km
  },
  flights: {
    shortHaul: 255,  // kg CO₂e per flight (< 3h)
    longHaul: 1100,  // kg CO₂e per flight (> 6h)
  },
  diet: {
    'heavy-meat': 2500,   // kg CO₂e/year
    'low-meat': 1700,     // kg CO₂e/year
    vegetarian: 1100,     // kg CO₂e/year
    vegan: 700,           // kg CO₂e/year
  },
  shopping: {
    high: 0.05,    // kg CO₂e/₹
    medium: 0.03,  // kg CO₂e/₹
    low: 0.01,     // kg CO₂e/₹
  },
  recyclingDiscount: 0.15, // 15% reduction in consumption emissions
});

export const INPUT_LIMITS = Object.freeze({
  householdSize: { min: 1, max: 20, default: 1 },
  electricityKwh: { min: 0, max: 10000, default: 300 },
  acHours: { min: 0, max: 24, default: 0 },
  heatingTherms: { min: 0, max: 500, default: 20 },
  weeklyKm: { min: 0, max: 5000, default: 100 },
  publicTransportKm: { min: 0, max: 5000, default: 0 },
  shortFlights: { min: 0, max: 50, default: 2 },
  longFlights: { min: 0, max: 20, default: 1 },
  monthlySpend: { min: 0, max: 100000, default: 5000 },
});

export const COUNTRY_GRID_FACTORS: Record<string, number> = {
  'Global Average': 0.47,
  'India': 0.71,
  'Japan': 0.48,
  'China': 0.53,
  'South Korea': 0.42,
  'North Korea': 0.73,
  'Russia': 0.35,
  'Spain': 0.14,
  'Australia': 0.58,
  'Canada': 0.12,
  'United States': 0.37,
  'United Kingdom': 0.21,
  'Germany': 0.39,
  'France': 0.06,
  'Norway': 0.03,
  'South Africa': 0.84,
  'Brazil': 0.09,
};

export const BENCHMARK_DATA = Object.freeze({
  indiaAvg: 2.0,       // metric tons CO₂/year
  urbanIndiaAvg: 3.0,  // metric tons CO₂/year (realistic baseline for web app users)
  globalAvg: 4.7,      // metric tons CO₂/year
  top10Pct: 1.3,       // metric tons CO₂/year
  parisTarget: 2.0,    // metric tons CO₂/year per capita by 2030
  netZeroTarget: 0.5,

  // Per-capita CO2 emissions from fossil fuels (tons/year) - Source: OWID 2022
  perCapita: {
    'Global Average': 4.7,
    India: 2.0,
    Japan: 8.2,
    China: 8.2,
    'South Korea': 11.7,
    'North Korea': 2.1,
    Russia: 11.5,
    Spain: 4.9,
    Australia: 14.7,
    Canada: 14.1,
    'United States': 14.8,
    'United Kingdom': 4.6,
    Germany: 7.9,
    France: 4.5,
    Norway: 7.5,
    'South Africa': 6.9,
    Brazil: 2.3,
  } as Record<string, number>,
});

export const GAS_HEATING_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Canada',
  'Norway',
  'South Korea'
];

export const APP_CONFIG = Object.freeze({
  maxHistoryEntries: 30,
  maxChatMessages: 50,
  aiTimeoutMs: 3000,
  chatDebounceMs: 2000,
  schemaVersion: 1,
  sustainableMonthlyKgTarget: 166.7, // 2000 kg/year / 12
});

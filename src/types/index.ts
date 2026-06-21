/**
 * @fileoverview Central TypeScript type definitions for the CarbonSense application.
 * Declares all shared types, interfaces, and enumerations used across services,
 * store slices, and UI components.
 */

// ─────────────────────────────────────
//  types/index.ts — All TypeScript types
// ─────────────────────────────────────

/** The source of electricity used by the household (grid, solar, or a mix). */
export type ElectricitySource = 'grid' | 'solar' | 'mixed';
/** The type of personal vehicle owned or primarily used. */
export type VehicleType = 'petrol' | 'diesel' | 'ev' | 'none' | 'twoWheeler';
/** The user's dietary preference category. */
export type DietType = 'heavy-meat' | 'low-meat' | 'vegetarian' | 'vegan';
/** Recommendation priority level: P0 = highest impact, P2 = lowest. */
export type Priority = 'P0' | 'P1' | 'P2';
/** How hard a recommended action is to implement for an average user. */
export type Difficulty = 'easy' | 'moderate' | 'hard';
/** When the recommended action can realistically be achieved. */
export type Timeframe = 'immediate' | 'short-term' | 'long-term';
/** Top-level emission category for a recommendation or breakdown value. */
export type Category = 'energy' | 'transport' | 'diet' | 'consumption';
/** Direction of the user’s carbon footprint trend over time. */
export type RiskTrend = 'increasing' | 'stable' | 'decreasing';
/** AI-assigned persona label summarising the user’s emission profile. */
export type DNAPersona =
  | 'Eco-Leader'
  | 'Urban Commuter'
  | 'Energy-Intensive Resident'
  | 'Industrial Consumer'
  | 'Balanced Emitter';
/** Communication style used by the AI sustainability coach. */
export type CoachPersona = 'friendly' | 'strict' | 'scientist';
/** UI colour theme preference. */
export type Theme = 'dark' | 'light';
/** App display language. */
export type Language = 'en' | 'hi' | 'es';
/** Indicates whether an AI response came from the local fallback or the Gemini cloud model. */
export type AISource = 'local' | 'gemini';

/** All user-supplied inputs to the carbon footprint calculator. */
export interface CalculatorInputs {
  country: string;
  householdSize: number;
  electricityKwh: number;
  electricitySource: ElectricitySource;
  acHours: number;
  heatingTherms: number;
  lpgCylinders: number;
  vehicleType: VehicleType;
  weeklyKm: number;
  publicTransportKm: number;
  publicTransitMode: 'bus' | 'metro';
  shortFlights: number;
  longFlights: number;
  dietType: DietType;
  monthlySpend: number;
  recycling: boolean;
}

/** The absolute kg and percentage share of a single emission category within a carbon result. */
export interface CategoryBreakdown {
  kg: number;
  percentage: number;
}

/** Full carbon footprint result for a single calculator submission, including category breakdown and timestamp. */
export interface CarbonResult {
  totalAnnualKg: number;
  totalAnnualTons: number;
  breakdown: {
    energy: CategoryBreakdown;
    transport: CategoryBreakdown;
    diet: CategoryBreakdown;
    consumption: CategoryBreakdown;
  };
  primaryDriver: Category;
  timestamp: number;
}

/** AI-generated user persona characterising the dominant emission driver and improvement potential. */
export interface CarbonDNA {
  persona: DNAPersona;
  primarySource: string;
  primaryPercentage: number;
  riskTrend: RiskTrend;
  reductionPotential: number;
}

/** A single actionable sustainability recommendation with impact estimates and metadata. */
export interface Recommendation {
  id: string;
  action: string;
  reason: string;
  impactKg: number;
  difficulty: Difficulty;
  timeframe: Timeframe;
  priority: Priority;
  category: Category;
}

/** Tracks a user’s gamified habit-completion progress including streaks, eco points, and badges. */
export interface HabitState {
  completedTaskIds: string[];
  totalSuggested: number;
  ecoPoints: number;
  ecoLevel: string;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
}

/** A single message in the AI advisor chat thread. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source: AISource;
  timestamp: number;
}

/** User-controlled application preferences including theme, language, and AI coach persona. */
export interface AppSettings {
  theme: Theme;
  eli10Mode: boolean;
  language: Language;
  coachPersona: CoachPersona;
  currencyOverride?: string | null;
}

/** Wrapper for an AI text response that also identifies whether it came from the cloud model or local fallback. */
export interface AIResponse {
  text: string;
  source: AISource;
}

/** Comparison of a user’s annual footprint against country, global, and top-10% benchmarks. */
export interface BenchmarkResult {
  countryName: string;
  countryAvg: number;
  globalAvg: number;
  top10Pct: number;
  userTons: number;
  vsCountry: number;
  vsGlobal: number;
  vsTop10: number;
  narrative: string;
}

/** Monthly and weekly carbon budget calculations relative to the 2-tonne sustainable target. */
export interface BudgetInfo {
  monthlyBudgetKg: number;
  weeklyBudgetKg: number;
  sustainableMonthlyKg: number;
  percentOfTarget: number;
  isOverBudget: boolean;
  alertMessage: string;
  status: 'good' | 'warning' | 'critical';
}

/** Business-as-usual vs sustainable trajectory projections for charting future emissions. */
export interface ProjectionResult {
  bau: number[];
  sustainable: number[];
  years: number[];
}

/** Outcome of the runtime security self-audit covering storage safety, CSP, and error boundaries. */
export interface SecurityAuditResult {
  inputValidationActive: boolean;
  storageSanitized: boolean;
  errorBoundaryActive: boolean;
  cspEnabled: boolean;
  overallStatus: 'secure' | 'warning';
}

// ── Zustand Store Slices ──────────────────────────────────

/** Zustand slice state for the carbon footprint calculator. */
export interface CalculatorSliceState {
  inputs: CalculatorInputs;
  result: CarbonResult | null;
  dna: CarbonDNA | null;
  recommendations: Recommendation[];
  history: CarbonResult[];
}

/** Zustand slice actions for updating and resetting calculator state. */
export interface CalculatorSliceActions {
  setInputs: (inputs: Partial<CalculatorInputs>) => void;
  setPipelineResult: (data: { result: CarbonResult; dna: CarbonDNA; recommendations: Recommendation[]; history: CarbonResult[] }) => void;
  resetCalculator: () => void;
}

/** Zustand slice state for the user’s habit tracking progress. */
export interface HabitSliceState {
  habits: HabitState;
}

/** Zustand slice actions for managing habit completion, badges, and session evaluation. */
export interface HabitSliceActions {
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  setTotalSuggested: (count: number) => void;
  addBadge: (badge: string) => void;
  evaluateSession: () => void;
  resetHabits: () => void;
}

/** Zustand slice state for the AI advisor chat messages. */
export interface ChatSliceState {
  messages: ChatMessage[];
  isLoading: boolean;
}

/** Zustand slice actions for managing chat messages and loading state. */
export interface ChatSliceActions {
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
}

/** Zustand slice state for user application settings. */
export interface SettingsSliceState {
  settings: AppSettings;
}

/** Zustand slice actions for mutating app settings. */
export interface SettingsSliceActions {
  setTheme: (theme: Theme) => void;
  toggleEli10: () => void;
  setLanguage: (lang: Language) => void;
  setCoachPersona: (persona: CoachPersona) => void;
  setCurrencyOverride: (currency: string | null) => void;
}

/**
 * The complete Zustand store state, composed of all slice states and actions.
 * This is the single source of truth for the entire application.
 */
export type AppState = CalculatorSliceState &
  CalculatorSliceActions &
  HabitSliceState &
  HabitSliceActions &
  ChatSliceState &
  ChatSliceActions &
  SettingsSliceState &
  SettingsSliceActions;

// ─────────────────────────────────────
//  types/index.ts — All TypeScript types
// ─────────────────────────────────────

export type ElectricitySource = 'grid' | 'solar' | 'mixed';
export type VehicleType = 'petrol' | 'diesel' | 'ev' | 'none' | 'bus' | 'metro' | 'twoWheeler';
export type DietType = 'heavy-meat' | 'low-meat' | 'vegetarian' | 'vegan';
export type Priority = 'P0' | 'P1' | 'P2';
export type Difficulty = 'easy' | 'moderate' | 'hard';
export type Timeframe = 'immediate' | 'short-term' | 'long-term';
export type Category = 'energy' | 'transport' | 'diet' | 'consumption';
export type RiskTrend = 'increasing' | 'stable' | 'decreasing';
export type DNAPersona =
  | 'Eco-Leader'
  | 'Urban Commuter'
  | 'Energy-Intensive Resident'
  | 'Industrial Consumer'
  | 'Balanced Emitter';
export type CoachPersona = 'friendly' | 'strict' | 'scientist';
export type Theme = 'dark' | 'light';
export type Language = 'en' | 'hi' | 'es';
export type AISource = 'local' | 'gemini';

export interface CalculatorInputs {
  country: string;
  householdSize: number;
  electricityKwh: number;
  electricitySource: ElectricitySource;
  acHours: number;
  heatingTherms: number;
  vehicleType: VehicleType;
  weeklyKm: number;
  publicTransportKm: number;
  shortFlights: number;
  longFlights: number;
  dietType: DietType;
  monthlySpend: number;
  recycling: boolean;
}

export interface CategoryBreakdown {
  kg: number;
  percentage: number;
}

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

export interface CarbonDNA {
  persona: DNAPersona;
  primarySource: string;
  primaryPercentage: number;
  riskTrend: RiskTrend;
  reductionPotential: number;
}

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

export interface HabitState {
  completedTaskIds: string[];
  totalSuggested: number;
  ecoPoints: number;
  ecoLevel: string;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source: AISource;
  timestamp: number;
}

export interface AppSettings {
  theme: Theme;
  eli10Mode: boolean;
  language: Language;
  coachPersona: CoachPersona;
  geminiApiKey: string | null;
}

export interface AIResponse {
  text: string;
  source: AISource;
}

export interface BenchmarkResult {
  indiaAvg: number;
  globalAvg: number;
  top10Pct: number;
  userTons: number;
  vsIndia: number;
  vsGlobal: number;
  vsTop10: number;
  narrative: string;
}

export interface BudgetInfo {
  monthlyBudgetKg: number;
  weeklyBudgetKg: number;
  sustainableMonthlyKg: number;
  percentOfTarget: number;
  isOverBudget: boolean;
  alertMessage: string;
  status: 'good' | 'warning' | 'critical';
}

export interface ProjectionResult {
  bau: number[];
  sustainable: number[];
  years: number[];
}

export interface SecurityAuditResult {
  inputValidationActive: boolean;
  storageSanitized: boolean;
  errorBoundaryActive: boolean;
  apiKeySecured: boolean;
  cspEnabled: boolean;
  overallStatus: 'secure' | 'warning';
}

// ── Zustand Store Slices ──────────────────────────────────

export interface CalculatorSliceState {
  inputs: CalculatorInputs;
  result: CarbonResult | null;
  dna: CarbonDNA | null;
  recommendations: Recommendation[];
  history: CarbonResult[];
}

export interface CalculatorSliceActions {
  setInputs: (inputs: Partial<CalculatorInputs>) => void;
  setPipelineResult: (data: { result: CarbonResult; dna: CarbonDNA; recommendations: Recommendation[]; history: CarbonResult[] }) => void;
  resetCalculator: () => void;
}

export interface HabitSliceState {
  habits: HabitState;
}

export interface HabitSliceActions {
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  setTotalSuggested: (count: number) => void;
  addBadge: (badge: string) => void;
  evaluateSession: () => void;
  resetHabits: () => void;
}

export interface ChatSliceState {
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface ChatSliceActions {
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
}

export interface SettingsSliceState {
  settings: AppSettings;
}

export interface SettingsSliceActions {
  setTheme: (theme: Theme) => void;
  toggleEli10: () => void;
  setLanguage: (lang: Language) => void;
  setCoachPersona: (persona: CoachPersona) => void;
  setGeminiApiKey: (key: string) => void;
  clearGeminiApiKey: () => void;
}

export type AppState = CalculatorSliceState &
  CalculatorSliceActions &
  HabitSliceState &
  HabitSliceActions &
  ChatSliceState &
  ChatSliceActions &
  SettingsSliceState &
  SettingsSliceActions;

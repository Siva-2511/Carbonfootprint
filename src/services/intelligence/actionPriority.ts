import type { CarbonDNA, CarbonResult, Category, Priority, Recommendation } from '../../types';

const RECOMMENDATION_POOL: Recommendation[] = [
  // ── TRANSPORT P0 ─────────────────────────────────────────
  { id: 't-p0-1', category: 'transport', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 412, action: 'Switch to bus travel twice a week', reason: 'Transport contributes to your largest emission source. Bus travel twice weekly reduces annual emissions by ~412 kg CO₂e.' },
  { id: 't-p0-2', category: 'transport', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 280, action: 'Carpool with a colleague 3 days a week', reason: 'Sharing rides halves per-person transport emissions. Carpooling 3 days saves ~280 kg CO₂e annually.' },
  { id: 't-p0-3', category: 'transport', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 200, action: 'Walk or cycle for trips under 3 km', reason: 'Short trips account for 30% of fuel use. Zero-emission travel for short distances saves ~200 kg CO₂e annually.' },
  // ── TRANSPORT P1 ─────────────────────────────────────────
  { id: 't-p1-1', category: 'transport', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 600, action: 'Replace one short-haul flight with train travel', reason: 'Trains emit 85% less CO₂ than planes on equivalent routes, saving ~600 kg per avoided flight.' },
  { id: 't-p1-2', category: 'transport', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 350, action: 'Use metro or train for work commute daily', reason: 'Metro emits only 0.03 kg CO₂e/km vs 0.21 for petrol car. Daily metro use saves ~350 kg annually.' },
  // ── TRANSPORT P2 ─────────────────────────────────────────
  { id: 't-p2-1', category: 'transport', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 1200, action: 'Switch to an electric vehicle', reason: 'EVs emit 76% less CO₂ than petrol cars over their lifetime. Switching could save 1200+ kg CO₂e annually.' },
  { id: 't-p2-2', category: 'transport', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 2000, action: 'Reduce long-haul flights by 50%', reason: 'Long-haul flights are extremely carbon-intensive at 1100 kg CO₂e per trip. Cutting flights in half saves 2000+ kg.' },

  // ── ENERGY P0 ────────────────────────────────────────────
  { id: 'e-p0-1', category: 'energy', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 250, action: 'Switch all bulbs to LED', reason: 'LED bulbs use 75% less electricity than incandescent. Fully switching saves ~250 kg CO₂e annually.' },
  { id: 'e-p0-2', category: 'energy', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 220, action: 'Set water heater to 50°C (not 60°C)', reason: 'Lowering water heater temperature by 10°C reduces heating energy by 20%, saving ~220 kg CO₂e annually.' },
  { id: 'e-p0-3', category: 'energy', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 180, action: 'Unplug devices and use smart power strips', reason: 'Standby power accounts for 10% of home electricity. Eliminating phantom load saves ~180 kg CO₂e annually.' },
  // ── ENERGY P1 ────────────────────────────────────────────
  { id: 'e-p1-1', category: 'energy', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 400, action: 'Use energy on non-peak hours (before 7am or after 10pm)', reason: 'Grid is cleaner at off-peak hours. Shifting heavy appliances saves ~400 kg CO₂e annually.' },
  { id: 'e-p1-2', category: 'energy', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 320, action: 'Wash clothes in cold water and air dry', reason: 'Heating water accounts for 90% of washing machine energy. Cold-wash + air-dry saves ~320 kg CO₂e annually.' },
  // ── ENERGY P2 ────────────────────────────────────────────
  { id: 'e-p2-1', category: 'energy', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 1500, action: 'Install rooftop solar panels', reason: 'Solar generates zero-emission electricity. A 2kW system offsets ~1500 kg CO₂e annually at India grid intensity.' },
  { id: 'e-p2-2', category: 'energy', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 800, action: 'Switch to a green energy tariff or supplier', reason: 'Green energy plans source from renewables, reducing your grid electricity factor from 0.42 to near zero.' },

  // ── DIET P0 ──────────────────────────────────────────────
  { id: 'd-p0-1', category: 'diet', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 300, action: 'Have 2 meat-free days per week', reason: 'Meat production is highly emission-intensive. Two meatless days weekly saves ~300 kg CO₂e annually.' },
  { id: 'd-p0-2', category: 'diet', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 200, action: 'Reduce beef and lamb; switch to chicken or fish', reason: 'Beef produces 27x more emissions than chicken. Swapping red meat saves ~200 kg CO₂e annually.' },
  // ── DIET P1 ──────────────────────────────────────────────
  { id: 'd-p1-1', category: 'diet', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 500, action: 'Adopt a predominantly vegetarian diet', reason: 'Vegetarian diets produce 50% less CO₂e than heavy-meat diets, saving ~500 kg annually for most people.' },
  { id: 'd-p1-2', category: 'diet', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 250, action: 'Buy seasonal and local produce', reason: 'Local seasonal food has 50% lower transport emissions. Choosing local saves ~250 kg CO₂e annually.' },
  // ── DIET P2 ──────────────────────────────────────────────
  { id: 'd-p2-1', category: 'diet', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 800, action: 'Transition to a vegan diet', reason: 'Vegan diets have 72% lower greenhouse gas impact than heavy-meat diets, saving up to 800 kg CO₂e annually.' },
  { id: 'd-p2-2', category: 'diet', priority: 'P2', difficulty: 'moderate', timeframe: 'long-term', impactKg: 150, action: 'Reduce food waste by meal planning', reason: '8% of global emissions come from food waste. Planning meals to avoid waste saves ~150 kg CO₂e annually.' },

  // ── CONSUMPTION P0 ───────────────────────────────────────
  { id: 'c-p0-1', category: 'consumption', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 300, action: 'Start composting kitchen and garden waste', reason: 'Composting diverts organic waste from landfills, preventing methane emissions worth ~300 kg CO₂e annually.' },
  { id: 'c-p0-2', category: 'consumption', priority: 'P0', difficulty: 'easy', timeframe: 'immediate', impactKg: 200, action: 'Carry reusable bags, bottles, and containers', reason: 'Single-use plastics require high-emission manufacturing. Eliminating them saves ~200 kg CO₂e annually.' },
  // ── CONSUMPTION P1 ───────────────────────────────────────
  { id: 'c-p1-1', category: 'consumption', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 400, action: 'Buy second-hand clothing and electronics', reason: 'Fashion and electronics are highly emission-intensive. Buying secondhand saves ~400 kg CO₂e annually.' },
  { id: 'c-p1-2', category: 'consumption', priority: 'P1', difficulty: 'moderate', timeframe: 'short-term', impactKg: 250, action: 'Repair items instead of replacing them', reason: 'Manufacturing new products is 4-10x more emissions-intensive than repair. Repairing saves ~250 kg CO₂e annually.' },
  // ── CONSUMPTION P2 ───────────────────────────────────────
  { id: 'c-p2-1', category: 'consumption', priority: 'P2', difficulty: 'hard', timeframe: 'long-term', impactKg: 600, action: 'Adopt a minimal consumption lifestyle', reason: 'Reducing overall purchasing by 30% can cut consumption-related emissions by ~600 kg CO₂e annually.' },
];

const PRIORITY_ORDER: Record<Recommendation['priority'], number> = { P0: 0, P1: 1, P2: 2 };

/** Returns ranked recommendations based on user's carbon profile. */
export function rank(result: CarbonResult, _dna: CarbonDNA): Recommendation[] {
  const { primaryDriver } = result;
  const categories: Category[] = [
    primaryDriver,
    ...(['energy', 'transport', 'diet', 'consumption'] as Category[]).filter((c) => c !== primaryDriver),
  ];

  // Include recs for all categories, weighted towards primary
  const sorted = [...RECOMMENDATION_POOL].sort((a, b) => {
    const prio = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (prio !== 0) return prio;
    const catA = categories.indexOf(a.category);
    const catB = categories.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return b.impactKg - a.impactKg;
  });

  return sorted;
}

/** Promotes top P1 to P0 in categories where all P0 are completed. */
export function promoteRecommendations(
  recs: Recommendation[],
  completedIds: string[]
): Recommendation[] {
  return recs.map((rec) => {
    if (rec.priority !== 'P1') return rec;

    const categoryP0 = recs.filter((r) => r.category === rec.category && r.priority === 'P0');
    const allP0Completed = categoryP0.length > 0 && categoryP0.every((r) => completedIds.includes(r.id));
    if (!allP0Completed) return rec;

    // Is this the highest-impact P1 in this category?
    const categoryP1 = recs.filter((r) => r.category === rec.category && r.priority === 'P1');
    const topP1 = categoryP1.reduce((a, b) => (a.impactKg > b.impactKg ? a : b), categoryP1[0]);
    if (topP1 && topP1.id === rec.id) {
      return { ...rec, priority: 'P0' as Priority };
    }
    return rec;
  });
}

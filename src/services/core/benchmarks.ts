import { BENCHMARK_DATA } from '../../config';
import type { BenchmarkResult } from '../../types';

/** Compares user's annual tons to global benchmarks. */
export function compareToBenchmarks(totalTons: number): BenchmarkResult {
  const safe = Number.isFinite(totalTons) && totalTons >= 0 ? totalTons : 0;

  const vsIndia = Math.round(((safe - BENCHMARK_DATA.indiaAvg) / BENCHMARK_DATA.indiaAvg) * 100);
  const vsUrbanIndia = Math.round(((safe - BENCHMARK_DATA.urbanIndiaAvg) / BENCHMARK_DATA.urbanIndiaAvg) * 100);
  const vsGlobal = Math.round(((safe - BENCHMARK_DATA.globalAvg) / BENCHMARK_DATA.globalAvg) * 100);
  const vsTop10 = Math.round(((safe - BENCHMARK_DATA.top10Pct) / BENCHMARK_DATA.top10Pct) * 100);

  const buildNarrative = (diff: number, label: string) => {
    if (diff === 0) return `Your emissions match the ${label}.`;
    const abs = Math.abs(diff);
    return diff < 0
      ? `You emit ${abs}% less than the ${label}.`
      : `You emit ${abs}% more than the ${label}.`;
  };

  return {
    indiaAvg: BENCHMARK_DATA.indiaAvg,
    globalAvg: BENCHMARK_DATA.globalAvg,
    top10Pct: BENCHMARK_DATA.top10Pct,
    userTons: safe,
    vsIndia,
    vsGlobal,
    vsTop10,
    narrative: buildNarrative(vsUrbanIndia, 'typical urban India households'),
  };
}

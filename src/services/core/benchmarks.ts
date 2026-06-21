import { BENCHMARK_DATA } from '../../config';
import type { BenchmarkResult } from '../../types';

/** Compares user's annual tons to global benchmarks. */
export function compareToBenchmarks(totalTons: number, country: string = 'India'): BenchmarkResult {
  const safe = Number.isFinite(totalTons) && totalTons >= 0 ? totalTons : 0;
  const countryAvg = BENCHMARK_DATA.perCapita[country] || BENCHMARK_DATA.globalAvg;

  const vsCountry = Math.round(((safe - countryAvg) / countryAvg) * 100);
  const vsGlobal = Math.round(((safe - BENCHMARK_DATA.globalAvg) / BENCHMARK_DATA.globalAvg) * 100);
  const vsTop10 = Math.round(((safe - BENCHMARK_DATA.top10Pct) / BENCHMARK_DATA.top10Pct) * 100);

  const buildNarrative = (diff: number, label: string) => {
    if (diff === 0) return `Your emissions match the ${label}.`;
    const abs = Math.abs(diff);
    return diff < 0
      ? `You emit ${abs}% less than the ${label}.`
      : `You emit ${abs}% more than the ${label}.`;
  };

  const narrative = country === 'India'
    ? buildNarrative(Math.round(((safe - BENCHMARK_DATA.urbanIndiaAvg) / BENCHMARK_DATA.urbanIndiaAvg) * 100), 'typical urban India households')
    : buildNarrative(vsCountry, `the average person in ${country}`);

  return {
    countryName: country,
    countryAvg,
    globalAvg: BENCHMARK_DATA.globalAvg,
    top10Pct: BENCHMARK_DATA.top10Pct,
    userTons: safe,
    vsCountry,
    vsGlobal,
    vsTop10,
    narrative,
  };
}

/** Automatically simplifies technical sustainability text for ELI10 mode. */
export function simplify(technical: string): string {
  if (typeof technical !== 'string' || !technical) return technical;

  return technical
    .replace(/\d+(\.\d+)?\s*(?:metric\s*)?tons?\s*(?:CO₂e?|CO2e?)/gi, 'a significant amount of greenhouse gas')
    .replace(/\d+(\.\d+)?\s*kg\s*(?:CO₂e?|CO2e?)/gi, 'some pollution')
    .replace(/(?:CO₂|CO2)e?/gi, 'greenhouse gas')
    .replace(/\b(?:carbon\s*)?emissions?\b/gi, 'pollution')
    .replace(/\bcarbon\s*footprint\b/gi, 'pollution level')
    .replace(/\bannually\b|\bper\s*year\b/gi, 'each year')
    .replace(/\btransportation\b|\bcommut(?:e|ing)\b/gi, 'travel')
    .replace(/\bconsumption\b/gi, 'shopping habits')
    .replace(/\belectricity\s*consumption\b/gi, 'electricity use')
    .replace(/\bkWh\b/gi, 'units of electricity')
    .replace(/\bIPCC\b/gi, 'science')
    .replace(/\bmetric\s*tons?\b/gi, 'tons')
    .trim();
}

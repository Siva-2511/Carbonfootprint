import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { useStore } from '../../core/store';

export function Simulator() {
  const result = useStore((s) => s.result);
  
  const [driveReduction, setDriveReduction] = useState(0);
  const [flightReduction, setFlightReduction] = useState(0);
  const [meatReduction, setMeatReduction] = useState(0);
  
  const simulatedKg = React.useMemo(() => {
    if (!result) return 0;
    const baseTransport = result.breakdown.transport.kg;
    const baseDiet = result.breakdown.diet.kg;
    const transportSavings = baseTransport * ((driveReduction * 0.4 + flightReduction * 0.6) / 100);
    const dietSavings = baseDiet * (meatReduction / 100);
    const newTotal = result.totalAnnualKg - transportSavings - dietSavings;
    return Math.max(0, Math.round(newTotal));
  }, [driveReduction, flightReduction, meatReduction, result]);

  if (!result || result.totalAnnualKg === 0) {
    return (
      <Card className="p-6 h-full flex flex-col justify-center text-center">
        <span className="text-3xl mb-4">🎛️</span>
        <h3 className="font-display font-bold text-xl text-primary mb-2">Impact Simulator</h3>
        <p className="text-secondary text-sm">Calculate your footprint first to unlock the what-if simulator.</p>
      </Card>
    );
  }

  const savedKg = result.totalAnnualKg - simulatedKg;
  const savedPct = Math.round((savedKg / result.totalAnnualKg) * 100) || 0;

  return (
    <Card className="p-6 flex flex-col h-full relative overflow-hidden">
      {/* Decorative spinning background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none -z-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl" aria-hidden="true">🎛️</span>
        <h2 className="text-xl font-bold font-display text-primary">What-If Simulator</h2>
      </div>

      <div className="space-y-6 flex-grow relative z-10">
        <Slider
          label="Drive Less"
          value={driveReduction}
          onChange={setDriveReduction}
          min={0}
          max={100}
          step={5}
          unit="%"
          color="emerald"
        />
        <Slider
          label="Fly Less"
          value={flightReduction}
          onChange={setFlightReduction}
          min={0}
          max={100}
          step={10}
          unit="%"
          color="blue"
        />
        <Slider
          label="Reduce Meat/Dairy"
          value={meatReduction}
          onChange={setMeatReduction}
          min={0}
          max={100}
          step={10}
          unit="%"
          color="amber"
        />
      </div>

      <div className="mt-8 pt-6 border-t border-card relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">New Footprint</p>
            <p className="text-3xl font-bold text-primary font-display">
              {simulatedKg} <span className="text-sm font-medium text-secondary">kg CO₂e</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Potential Savings</p>
            <p className="text-2xl font-bold text-emerald-400 font-display">
              -{savedPct}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

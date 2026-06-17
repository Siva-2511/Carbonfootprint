import React, { useState } from 'react';

const PRODUCTS = [
  { id: 'beef', name: 'Beef (1kg)', co2: 27.0, category: 'Food' },
  { id: 'chicken', name: 'Chicken (1kg)', co2: 6.9, category: 'Food' },
  { id: 'lentils', name: 'Lentils (1kg)', co2: 0.9, category: 'Food' },
  { id: 'jeans', name: 'Cotton Jeans', co2: 33.4, category: 'Clothing' },
  { id: 'tshirt', name: 'Cotton T-Shirt', co2: 7.0, category: 'Clothing' },
  { id: 'smartphone', name: 'Smartphone', co2: 55.0, category: 'Electronics' },
  { id: 'laptop', name: 'Laptop', co2: 210.0, category: 'Electronics' },
];

export function ProductCompare() {
  const [item1, setItem1] = useState(PRODUCTS[0].id);
  const [item2, setItem2] = useState(PRODUCTS[2].id);

  const p1 = PRODUCTS.find((p) => p.id === item1)!;
  const p2 = PRODUCTS.find((p) => p.id === item2)!;

  const diff = Math.abs(p1.co2 - p2.co2);
  const ratio = Math.max(p1.co2, p2.co2) / Math.min(p1.co2, p2.co2);

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        ⚖️ Impact Comparison Tool
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        Compare the cradle-to-gate carbon footprint of common products to make more informed purchasing decisions.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-1">Product A</label>
          <select 
            value={item1} 
            onChange={(e) => setItem1(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Product B</label>
          <select 
            value={item2} 
            onChange={(e) => setItem2(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="relative pt-4">
        <div className="flex justify-between items-end mb-2">
          <div className="text-center w-1/2 pr-2">
            <p className="text-xl font-bold text-red-400">{p1.co2} <span className="text-sm">kg</span></p>
          </div>
          <div className="text-center w-1/2 pl-2">
            <p className="text-xl font-bold text-emerald-400">{p2.co2} <span className="text-sm">kg</span></p>
          </div>
        </div>
        
        <div className="h-4 flex rounded-full overflow-hidden bg-gray-800">
          <div 
            className="h-full bg-red-400/80 transition-all duration-500" 
            style={{ width: `${(p1.co2 / (p1.co2 + p2.co2)) * 100}%` }}
          />
          <div 
            className="h-full bg-emerald-400/80 transition-all duration-500" 
            style={{ width: `${(p2.co2 / (p1.co2 + p2.co2)) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/20">
        <p className="text-emerald-400 font-medium">
          {p1.co2 > p2.co2 ? p1.name : p2.name} produces <strong className="text-lg">{ratio.toFixed(1)}x</strong> more carbon than {p1.co2 > p2.co2 ? p2.name : p1.name}.
        </p>
        <p className="text-xs text-secondary mt-1">Difference: {diff.toFixed(1)} kg CO₂e</p>
      </div>
    </div>
  );
}

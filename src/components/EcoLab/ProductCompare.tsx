/**
 * @fileoverview ProductCompare component for the EcoLab section.
 * Allows users to compare the cradle-to-gate carbon footprint of two products
 * chosen from a preset list or entered as free-text custom items.
 * Custom product footprints are estimated in real-time via the AI service.
 * Results are visualised as a proportional bar and a ratio summary.
 */

import React, { useState } from 'react';
import { estimateProductFootprint } from '../../services/aiLayer';

const DEFAULT_PRODUCTS = [
  { id: 'beef', name: 'Beef (1kg)', co2: 27.0, category: 'Food' },
  { id: 'chicken', name: 'Chicken (1kg)', co2: 6.9, category: 'Food' },
  { id: 'lentils', name: 'Lentils (1kg)', co2: 0.9, category: 'Food' },
  { id: 'jeans', name: 'Cotton Jeans', co2: 33.4, category: 'Clothing' },
  { id: 'tshirt', name: 'Cotton T-Shirt', co2: 7.0, category: 'Clothing' },
  { id: 'smartphone', name: 'Smartphone', co2: 55.0, category: 'Electronics' },
  { id: 'laptop', name: 'Laptop', co2: 210.0, category: 'Electronics' },
  { id: 'custom_placeholder', name: 'Other (custom)...', co2: 0, category: 'Custom' }
];

/**
 * ProductCompare renders a two-product carbon footprint comparison tool.
 * Users select products from a preset list or type a custom item name;
 * custom items are sent to the AI service for footprint estimation.
 * The comparison renders a proportional bar chart and a textual summary
 * showing which product has the higher impact and by what factor.
 *
 * @returns The rendered product impact comparison card.
 */
export function ProductCompare() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [item1, setItem1] = useState(DEFAULT_PRODUCTS[0].id);
  const [item2, setItem2] = useState(DEFAULT_PRODUCTS[2].id);

  const [customInput1, setCustomInput1] = useState('');
  const [customInput2, setCustomInput2] = useState('');
  
  const [isComparing, setIsComparing] = useState(false);
  
  // Track successful estimates so we can render them
  const [result1, setResult1] = useState<string | null>(DEFAULT_PRODUCTS[0].id);
  const [result2, setResult2] = useState<string | null>(DEFAULT_PRODUCTS[2].id);

  const handleCompare = async () => {
    setIsComparing(true);
    let newId1 = result1;
    let newId2 = result2;
    const newProducts = [...products];

    // Estimate Product 1 if custom
    if (item1 === 'custom_placeholder' && customInput1.trim()) {
      const co2 = await estimateProductFootprint(customInput1);
      if (co2 !== null) {
        newId1 = `custom_${Date.now()}_1`;
        newProducts.splice(newProducts.length - 1, 0, { id: newId1, name: customInput1, co2, category: 'Custom' });
      } else {
        alert(`Failed to estimate footprint for "${customInput1}".`);
        setIsComparing(false);
        return;
      }
    } else if (item1 !== 'custom_placeholder') {
      newId1 = item1;
    }

    // Estimate Product 2 if custom
    if (item2 === 'custom_placeholder' && customInput2.trim()) {
      const co2 = await estimateProductFootprint(customInput2);
      if (co2 !== null) {
        newId2 = `custom_${Date.now()}_2`;
        newProducts.splice(newProducts.length - 1, 0, { id: newId2, name: customInput2, co2, category: 'Custom' });
      } else {
        alert(`Failed to estimate footprint for "${customInput2}".`);
        setIsComparing(false);
        return;
      }
    } else if (item2 !== 'custom_placeholder') {
      newId2 = item2;
    }

    setProducts(newProducts);
    setResult1(newId1);
    setResult2(newId2);
    
    // Auto-update dropdowns so they reflect the newly created items
    if (item1 === 'custom_placeholder') setItem1(newId1!);
    if (item2 === 'custom_placeholder') setItem2(newId2!);

    setIsComparing(false);
  };

  const p1 = products.find((p) => p.id === result1);
  const p2 = products.find((p) => p.id === result2);

  const validComparison = p1 && p2 && p1.id !== 'custom_placeholder' && p2.id !== 'custom_placeholder';
  const diff = validComparison ? Math.abs(p1.co2 - p2.co2) : 0;
  const ratio = validComparison && Math.min(p1.co2, p2.co2) > 0 
    ? Math.max(p1.co2, p2.co2) / Math.min(p1.co2, p2.co2) 
    : 0;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        ⚖️ Impact Comparison Tool
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        Compare the cradle-to-gate carbon footprint of common products to make more informed purchasing decisions.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Product A */}
        <div>
          <label className="block text-sm text-secondary mb-1">Product A</label>
          <select 
            value={item1} 
            onChange={(e) => {
              setItem1(e.target.value);
              setResult1(e.target.value === 'custom_placeholder' ? null : e.target.value);
            }}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {item1 === 'custom_placeholder' && (
            <div className="mt-2">
              <input 
                type="text" 
                placeholder="e.g. Washing Machine" 
                value={customInput1}
                onChange={(e) => setCustomInput1(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-sm text-primary"
              />
            </div>
          )}
        </div>

        {/* Product B */}
        <div>
          <label className="block text-sm text-secondary mb-1">Product B</label>
          <select 
            value={item2} 
            onChange={(e) => {
              setItem2(e.target.value);
              setResult2(e.target.value === 'custom_placeholder' ? null : e.target.value);
            }}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {item2 === 'custom_placeholder' && (
            <div className="mt-2">
              <input 
                type="text" 
                placeholder="e.g. Smart TV" 
                value={customInput2}
                onChange={(e) => setCustomInput2(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-sm text-primary"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleCompare}
          disabled={isComparing || (item1 === 'custom_placeholder' && !customInput1.trim()) || (item2 === 'custom_placeholder' && !customInput2.trim())}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors w-full md:w-auto"
        >
          {isComparing ? 'Estimating & Comparing...' : 'Compare Products'}
        </button>
      </div>

      {validComparison && (
        <div className="relative pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
          
          <div className="bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/20 mt-6">
            <p className="text-emerald-400 font-medium">
              {p1.co2 > p2.co2 ? p1.name : p2.name} produces <strong className="text-lg">{ratio.toFixed(1)}x</strong> more carbon than {p1.co2 > p2.co2 ? p2.name : p1.name}.
            </p>
            <p className="text-xs text-secondary mt-1">Difference: {diff.toFixed(1)} kg CO₂e</p>
          </div>
        </div>
      )}
    </div>
  );
}

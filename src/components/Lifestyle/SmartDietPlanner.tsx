import React, { useState } from 'react';
import { rawAIFetch } from '../../services/aiLayer';

interface MealPlan {
  theme: string;
  totalSavedCarbon: string;
  days: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }[];
}

export function SmartDietPlanner() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlan | null>(null);

  const generatePlan = async () => {
    if (!preferences.trim()) return;
    setLoading(true);
    
    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `I want a 7-day low-carbon meal plan. My preferences/restrictions: "${preferences}".
Focus on local, seasonal, and low-impact ingredients.
Return ONLY valid JSON with exactly this structure, no markdown formatting or extra text:
{"theme": "Theme of the week", "totalSavedCarbon": "e.g., 12 kg CO2e saved vs average diet", "days": [{"day": "Monday", "breakfast": "Meal desc", "lunch": "Meal desc", "dinner": "Meal desc"}]}`
      }], 0.7);
      
      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setPlan(JSON.parse(content));
      }
    } catch (e) {
      console.error('Diet planner failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          🥗
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">Smart Diet Meal Planner</h2>
          <p className="text-sm text-secondary">Generate a 7-day low-carbon meal plan based on your preferences</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
            placeholder="e.g., Gluten-free, love Mexican food, no dairy"
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <button
            onClick={generatePlan}
            disabled={loading || !preferences.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 sm:py-0 rounded-xl font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Planning...' : 'Generate Plan'}
          </button>
        </div>

        {plan && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div>
                <h3 className="text-lg font-bold text-emerald-400">{plan.theme}</h3>
              </div>
              <div className="mt-2 sm:mt-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                {plan.totalSavedCarbon}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {plan.days.map((day, i) => (
                <div key={i} className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl flex flex-col gap-3">
                  <h4 className="font-bold text-primary border-b border-white/10 pb-2">{day.day}</h4>
                  <div>
                    <div className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Breakfast</div>
                    <div className="text-sm text-secondary">{day.breakfast}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Lunch</div>
                    <div className="text-sm text-secondary">{day.lunch}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Dinner</div>
                    <div className="text-sm text-secondary">{day.dinner}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

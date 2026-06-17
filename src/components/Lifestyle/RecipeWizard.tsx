import React, { useState } from 'react';
import { useStore } from '../../core/store';

interface RecipeResult {
  title: string;
  ingredients: string[];
  instructions: string[];
  carbonFootprint: string;
  sustainabilityFact: string;
}

export function RecipeWizard() {
  const apiKey = useStore(s => s.settings.geminiApiKey);
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);

  const generateRecipe = async () => {
    if (!apiKey || !ingredients.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemma-4-31b-it:free',
          messages: [{
            role: 'user',
            content: `I have the following ingredients: ${ingredients}. Generate a creative, ultra-low-carbon recipe using some or all of these. 
Return ONLY valid JSON with exactly this structure, no markdown formatting or extra text:
{"title": "Recipe Name", "ingredients": ["item 1", "item 2"], "instructions": ["step 1", "step 2"], "carbonFootprint": "e.g., 0.5 kg CO2e", "sustainabilityFact": "Why this meal is good for the planet"}`
          }],
          temperature: 0.7
        })
      });
      
      const data = await res.json();
      let content = data?.choices?.[0]?.message?.content || '';
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      setRecipe(JSON.parse(content));
    } catch (e) {
      console.error('Recipe generation failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          🍲
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">AI Recipe Wizard</h2>
          <p className="text-sm text-secondary">Turn your fridge leftovers into a low-carbon meal</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., leftover rice, half an onion, two carrots, some tofu..."
          className="w-full bg-black/5 dark:bg-white/5 border border-card rounded-xl p-4 text-primary focus:border-emerald-500 transition-colors resize-none h-24"
        />
        
        <button 
          onClick={generateRecipe}
          disabled={loading || !ingredients.trim()}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 rounded-xl transition-all font-bold shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Consulting the Chef...
            </span>
          ) : 'Generate Eco-Recipe'}
        </button>
      </div>

      {recipe && !loading && (
        <div className="mt-8 space-y-6 animate-fade-in border-t border-card pt-6">
          <div className="text-center">
            <h3 className="font-display font-bold text-2xl text-emerald-400">{recipe.title}</h3>
            <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mt-2 uppercase tracking-wide">
              Impact: {recipe.carbonFootprint}
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-300">
            <span className="font-bold text-blue-400">🌱 Planet Fact: </span>
            {recipe.sustainabilityFact}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 glass-card p-4 bg-white/5">
              <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                <span>🛒</span> Ingredients
              </h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-secondary flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {ing}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2 glass-card p-4 bg-white/5">
              <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                <span>🍳</span> Instructions
              </h4>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-sm text-secondary flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

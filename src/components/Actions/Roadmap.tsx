import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { promoteRecommendations } from '../../services/intelligence/actionPriority';
import { getActionBreakdown } from '../../services/aiLayer';
import { simplify } from '../../services/core/textSimplifier';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

const PHASES = [
  { label: 'Phase 1: Quick Wins', key: 'P0', desc: 'Easy actions with immediate impact' },
  { label: 'Phase 2: Habit Formation', key: 'P1', desc: 'Build sustainable daily habits' },
  { label: 'Phase 3: Optimization', key: 'P2-mod', desc: 'Moderate lifestyle changes' },
  { label: 'Phase 4: Carbon Neutral', key: 'P2-hard', desc: 'Long-term systemic changes' },
];

export function Roadmap() {
  const recommendations = useStore((s) => s.recommendations);
  const habits = useStore((s) => s.habits);
  const eli10 = useStore((s) => s.settings.eli10Mode);
  const completeTask = useStore((s) => s.completeTask);
  const uncompleteTask = useStore((s) => s.uncompleteTask);
  const dna = useStore((s) => s.dna);
  const [activePhase, setActivePhase] = useState(0);
  const [breakdowns, setBreakdowns] = useState<Record<string, string>>({});
  const [loadingBreakdown, setLoadingBreakdown] = useState<string | null>(null);

  const handleGetBreakdown = async (actionId: string, actionName: string) => {
    if (breakdowns[actionId]) return;
    setLoadingBreakdown(actionId);
    const text = await getActionBreakdown(actionName, dna?.persona || 'User');
    if (text) {
      setBreakdowns(prev => ({ ...prev, [actionId]: text }));
    }
    setLoadingBreakdown(null);
  };

  const completedIds = habits.completedTaskIds;
  const promoted = promoteRecommendations(recommendations, completedIds);

  const phaseRecs = promoted.filter((r) => {
    if (activePhase === 0) return r.priority === 'P0';
    if (activePhase === 1) return r.priority === 'P1';
    if (activePhase === 2) return r.priority === 'P2' && r.difficulty !== 'hard';
    return r.priority === 'P2' && r.difficulty === 'hard';
  });

  const totalPhase = phaseRecs.length;
  const completedPhase = phaseRecs.filter((r) => completedIds.includes(r.id)).length;

  if (!recommendations.length) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="text-3xl mb-2">🗺️</div>
        <p>Calculate your footprint to get your personalized roadmap</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl text-primary">Action Roadmap</h2>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-500/30">
            {habits.ecoLevel}
          </span>
          <span aria-live="polite" className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
            🌱 <span className="metric font-semibold text-lg">{habits.ecoPoints}</span> pts
          </span>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {PHASES.map((p, i) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={activePhase === i}
            onClick={() => setActivePhase(i)}
            className={`whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg transition-all flex-shrink-0 ${
              activePhase === i
                ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/30'
                : 'text-muted hover:text-secondary hover:var-bg-card'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ProgressBar
        value={completedPhase}
        max={Math.max(totalPhase, 1)}
        label={`${completedPhase}/${totalPhase} completed`}
        showLabel
        color="emerald"
        size="md"
      />

      {/* Recommendations */}
      <div className="space-y-3" role="list">
        {phaseRecs.length === 0 && (
          <p className="text-sm text-muted text-center py-4">
            {completedPhase > 0 ? '✅ All actions in this phase completed!' : 'No actions for this phase yet.'}
          </p>
        )}
        {phaseRecs.map((rec) => {
          const done = completedIds.includes(rec.id);
          return (
            <div
              key={rec.id}
              role="listitem"
              className={`var-bg-card border rounded-xl p-4 transition-all ${done ? 'border-emerald-500/30 opacity-70' : 'border-card'}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`rec-${rec.id}`}
                  checked={done}
                  onChange={() => done ? uncompleteTask(rec.id) : completeTask(rec.id)}
                  className="mt-1 accent-emerald-500 w-4 h-4 flex-shrink-0 cursor-pointer"
                  aria-label={rec.action}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`rec-${rec.id}`}
                    className={`block font-medium text-sm cursor-pointer ${done ? 'line-through text-muted' : 'text-primary'}`}
                  >
                    {eli10 ? simplify(rec.action) : rec.action}
                  </label>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    {eli10 ? simplify(rec.reason) : rec.reason}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="success" size="sm">-{rec.impactKg} kg/yr</Badge>
                    <Badge variant="neutral" size="sm">{rec.difficulty}</Badge>
                    <Badge variant="neutral" size="sm">{rec.timeframe}</Badge>
                  </div>
                  
                  {!breakdowns[rec.id] && (
                    <button 
                      onClick={() => handleGetBreakdown(rec.id, rec.action)}
                      disabled={loadingBreakdown === rec.id}
                      className="mt-3 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {loadingBreakdown === rec.id ? (
                        <><div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> Thinking...</>
                      ) : '✨ AI Guide'}
                    </button>
                  )}
                  
                  {breakdowns[rec.id] && (
                    <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-sm text-secondary whitespace-pre-wrap leading-relaxed relative">
                      <span className="font-semibold text-emerald-400 mb-1 block flex items-center gap-1">
                        🤖 AI Action Guide
                      </span>
                      {breakdowns[rec.id]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


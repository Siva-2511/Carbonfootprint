import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../core/store';
import { chatWithAI } from '../../services/aiLayer';
import { BENCHMARK_DATA } from '../../config';

const SUGGESTIONS = [
  '🚗 Why is transport my biggest source?',
  '⚡ How can I reduce energy use?',
  '🥗 What if I went vegetarian?',
  '🌍 How to reach Net Zero?',
  '📊 Explain my carbon score',
];

function buildResponse(
  query: string,
  dna: { persona: string; primarySource: string; reductionPotential: number } | null,
  recs: Array<{ category: string; priority: string; action: string; impactKg: number }>,
  result: { totalAnnualTons: number; breakdown: Record<string, { kg: number; percentage: number }> } | null,
  persona: string
): string {
  const q = query.toLowerCase().trim();
  const tons    = result?.totalAnnualTons.toFixed(1) ?? 'unknown';
  const topRec  = recs.find((r) => r.priority === 'P0');
  const persona_ = dna?.persona ?? 'your profile';
  const reductPct = dna?.reductionPotential ?? 25;

  let answer: string;

  // ── Keyword routing ──
  if (/transport|car|driv|commut|flight|bus|metro/.test(q)) {
    const tPct = result?.breakdown.transport.percentage ?? 0;
    const tKg  = result?.breakdown.transport.kg ?? 0;
    answer = `Transport accounts for ${tPct}% of your footprint (${tKg.toLocaleString()} kg CO₂e/year). ` +
      `Key levers: switching to public transit saves ~400 kg/year, carpooling 2×/week saves ~300 kg/year, ` +
      `and switching from petrol to EV cuts transport emissions by ~65%. ` +
      (topRec?.category === 'transport' ? `Top action for you: "${topRec.action}" (-${topRec.impactKg} kg/yr).` : '');
  } else if (/energy|electric|power|solar|bulb|heat/.test(q)) {
    const ePct = result?.breakdown.energy.percentage ?? 0;
    const eKg  = result?.breakdown.energy.kg ?? 0;
    answer = `Energy use is ${ePct}% of your footprint (${eKg.toLocaleString()} kg CO₂e/year). ` +
      `LED lighting saves ~150 kg/year, setting AC to 26°C saves ~200 kg/year, ` +
      `rooftop solar can cut electricity emissions by 80%. ` +
      (topRec?.category === 'energy' ? `Your top action: "${topRec.action}" (-${topRec.impactKg} kg/yr).` : '');
  } else if (/vegetarian|vegan|plant|meat/.test(q)) {
    const dKg = result?.breakdown.diet.kg ?? 1700;
    const saving = Math.round(dKg * 0.35);
    answer = `Going vegetarian would cut your food emissions by ~35%, saving approximately ${saving} kg CO₂e/year. ` +
      `Even 2 meat-free days per week saves around ${Math.round(saving * 0.3)} kg/year. ` +
      `A full vegan diet could save up to ${Math.round(dKg * 0.58)} kg/year compared to a meat-heavy diet.`;
  } else if (/diet|food|eat/.test(q)) {
    const dPct = result?.breakdown.diet.percentage ?? 0;
    answer = `Diet contributes ${dPct}% of your annual footprint. Beef produces ~60 kg CO₂e/kg of food, ` +
      `while lentils produce only ~0.9 kg CO₂e/kg. Reducing red meat twice a week can save 300–500 kg CO₂e/year.`;
  } else if (/net.?zero|zero.?carbon|carbon.?neutral/.test(q)) {
    answer = `Reaching Net Zero from ${tons} tons/year is a 4-phase journey: ` +
      `Phase 1 (0–6 months): Quick wins like switching to LEDs, reducing AC use — save 200–400 kg/year. ` +
      `Phase 2 (6–12 months): Habit formation — metro commuting, meal planning — save 400–700 kg/year. ` +
      `Phase 3 (1–3 years): Lifestyle changes — EV switch, solar, dietary shift. ` +
      `Phase 4 (3–5 years): Systemic changes — home insulation, renewable energy certificates. ` +
      `Based on your ${persona_} profile, you have a ${reductPct}% reduction potential achievable in 6 months.`;
  } else if (/score|footprint|result|profile/.test(q)) {
    const score = Math.max(0, Math.round(100 - (parseFloat(tons) / 12.0) * 100));
    answer = `Your footprint is ${tons} tons CO₂e/year, giving you a sustainability score of ${score}/100. ` +
      `Your biggest emission source is ${result?.breakdown ? Object.entries(result.breakdown).sort((a,b)=>b[1].kg-a[1].kg)[0][0] : 'energy'}. ` +
      `Completing your Phase 1 actions can improve your score by 15–20 points.`;
  } else if (/what is carbon|carbon footprint mean|explain carbon/.test(q)) {
    answer = `A carbon footprint is the total amount of greenhouse gases (mainly CO₂) produced by your activities — ` +
      `driving, eating, using electricity, and shopping — measured in "tons CO₂ equivalent" per year. ` +
      `The global average is 4.7 tons/year; the sustainable target is 2.0 tons/year (Paris Agreement). ` +
      `Your current footprint is ${tons} tons/year.`;
  } else if (/tip|suggest|recommend|help|start|begin/.test(q)) {
    const actions = recs.filter((r) => r.priority === 'P0').slice(0, 3);
    if (actions.length) {
      answer = `Here are your top 3 quick wins:\n` +
        actions.map((a, i) => `${i+1}. ${a.action} — saves ${a.impactKg} kg CO₂e/year`).join('\n');
    } else {
      answer = `Complete your carbon profile first to get personalized recommendations tailored to your lifestyle.`;
    }
  } else if (/shopping|buy|consume|product|plastic/.test(q)) {
    const cKg = result?.breakdown.consumption.kg ?? 500;
    answer = `Your consumption footprint is ${cKg.toLocaleString()} kg CO₂e/year. ` +
      `Tips: Buy second-hand (saves ~80 kg/item), choose products with eco-labels, ` +
      `avoid single-use plastics, and reduce online returns (logistics emit ~0.5 kg CO₂ per delivery).`;
  } else {
    // Default: give a personalized overview
    const primary = result
      ? Object.entries(result.breakdown).sort((a,b)=>b[1].kg-a[1].kg)[0]
      : null;
    answer = `As a ${persona_}, your footprint is ${tons} tons CO₂e/year. ` +
      (primary ? `Your biggest source is ${primary[0]} (${primary[1].kg.toLocaleString()} kg/year). ` : '') +
      (topRec ? `Your most impactful quick action: "${topRec.action}" — saves ${topRec.impactKg} kg CO₂e/year.` : '') +
      ` You have a ${reductPct}% reduction potential with consistent action.`;
  }

  // Apply persona tone
  if (persona === 'strict') return `📊 Data: ${answer} — Track this weekly for accountability.`;
  if (persona === 'scientist') return `🔬 ${answer} (IPCC AR6 data; India grid factor: 0.42 kg CO₂e/kWh)`;
  return `💚 ${answer} Every action counts!`;
}

export function AdvisorChat() {
  const messages    = useStore((s) => s.messages);
  const isLoading   = useStore((s) => s.isLoading);
  const dna         = useStore((s) => s.dna);
  const recommendations = useStore((s) => s.recommendations);
  const result      = useStore((s) => s.result);
  const settings    = useStore((s) => s.settings);
  const addMessage  = useStore((s) => s.addMessage);
  const setLoading  = useStore((s) => s.setLoading);

  const [inputText, setInputText] = useState('');
  const [lastSent, setLastSent]   = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    const now = new Date().getTime();
    if (!trimmed || now - lastSent < 1500) return;
    setLastSent(now);
    setInputText('');
    addMessage({ role: 'user', text: trimmed, source: 'local' });
    setLoading(true);

    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const systemContext = `You are a CarbonSense AI sustainability advisor with a '${settings.coachPersona}' persona. 
The user's current carbon footprint is ${result?.totalAnnualTons.toFixed(1) || 'unknown'} tons CO2e/year. 
Their top recommended action is "${recommendations[0]?.action || 'none'}".
Please answer their question directly, accurately, and keeping your persona in mind. Keep answers concise (under 4 sentences if possible) and focus on practical sustainability.`;
    
    const { text: finalText, source } = await chatWithAI(trimmed, systemContext);
    
    if (finalText) {
      addMessage({ role: 'assistant', text: finalText, source });
    } else {
      const localText = buildResponse(trimmed, dna, recommendations, result, settings.coachPersona);
      addMessage({ role: 'assistant', text: localText, source: 'local' });
    }
    setLoading(false);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: '1rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    height: '540px',
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '12px' }}>
        <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          🤖 AI Sustainability Advisor
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
          Powered by local intelligence engine + Gemini
        </p>
      </div>

      {/* Suggestion chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', flexShrink: 0 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s.replace(/^[^\s]+ /, ''))}
            style={{
              whiteSpace: 'nowrap', fontSize: '12px', padding: '5px 12px',
              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
              color: '#34d399', borderRadius: '99px', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}
        aria-live="polite" aria-label="Chat messages" role="log"
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌱</div>
            <p style={{ fontSize: '14px' }}>Ask me anything about your carbon footprint!</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>I can answer any sustainability question</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }} className="animate-fade-in">
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.3))' : 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
              border: `1px solid ${msg.role === 'user' ? 'rgba(52,211,153,0.3)' : 'rgba(59,130,246,0.2)'}`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
              {msg.role === 'assistant' && (
                <span style={{
                  display: 'inline-block', marginTop: '8px',
                  padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 600,
                  background: msg.source === 'gemini' ? 'linear-gradient(90deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))' : 'rgba(255,255,255,0.05)',
                  color: msg.source === 'gemini' ? '#38bdf8' : 'var(--text-muted)',
                  border: `1px solid ${msg.source === 'gemini' ? 'rgba(56,189,248,0.3)' : 'var(--border-card)'}`,
                }}>
                  {msg.source === 'gemini' ? '✨ OpenRouter AI' : '🔧 Local Engine'}
                </span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="animate-fade-in">
            <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 200, 400].map((d) => (
                <span key={d} style={{ width: '8px', height: '8px', background: 'linear-gradient(to bottom, #34d399, #3b82f6)', borderRadius: '50%', display: 'inline-block', animation: `slideUp 0.6s ease-in-out ${d}ms infinite alternate` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(inputText)}
          placeholder="Ask me anything about sustainability..."
          aria-label="Chat input"
          style={{
            flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
            borderRadius: '12px', padding: '10px 14px', fontSize: '13px',
            color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim() || isLoading}
          className="btn-primary"
          style={{ padding: '10px 18px', flexShrink: 0 }}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}


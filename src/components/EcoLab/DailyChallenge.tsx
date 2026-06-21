/**
 * @fileoverview DailyChallenge component for the EcoLab section.
 * Renders an AI-powered sustainability trivia quiz that generates a new
 * multiple-choice question on demand via the rawAIFetch service.
 * Users select an answer, receive immediate feedback, and can chain
 * to the next challenge.
 */

import React, { useState } from 'react';
import { rawAIFetch } from '../../services/aiLayer';

/**
 * Represents the structure of a single AI-generated sustainability challenge.
 */
interface ChallengeState {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * DailyChallenge renders an interactive eco-trivia card.
 * It fetches an AI-generated multiple-choice sustainability question,
 * displays the options, highlights the correct/incorrect answer after
 * selection, and shows an explanation with an option to proceed to the
 * next challenge.
 *
 * @returns The rendered daily eco-challenge card.
 */
export function DailyChallenge() {
  const [challenge, setChallenge] = useState<ChallengeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  
  const generateChallenge = async () => {
    setLoading(true);
    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `Generate a fun, intermediate-level multiple choice sustainability trivia question. 
Return ONLY valid JSON in this exact format, with no markdown formatting or extra text:
{"question": "The question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0, "explanation": "Why this is correct"}`
      }], 0.7);
      
      if (contentStr) {
        // Strip markdown backticks if the AI accidentally adds them
        const cleaned = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned) as ChallengeState;
        setChallenge(parsed);
        setSelected(null);
      }
    } catch (e) {
      console.error('Challenge generation failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">
          🎲
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-primary">Daily Eco-Challenge</h2>
          <p className="text-sm text-secondary">Test your sustainability knowledge</p>
        </div>
      </div>
      
      {!challenge && !loading ? (
        <button 
          onClick={generateChallenge}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl transition-all font-medium"
        >
          Generate Today's Challenge
        </button>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-6 text-emerald-400">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm animate-pulse">Consulting the Oracle...</p>
        </div>
      ) : challenge ? (
        <div className="space-y-4 animate-fade-in">
          <p className="text-primary font-medium">{challenge.question}</p>
          <div className="space-y-2">
            {challenge.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === challenge.correctIndex;
              const showResult = selected !== null;
              
              let btnClass = "w-full text-left p-3 rounded-lg border transition-all text-sm ";
              if (!showResult) {
                btnClass += "border-card bg-emerald-500/5 hover:bg-emerald-500/10 text-secondary";
              } else if (isCorrect) {
                btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold";
              } else if (isSelected && !isCorrect) {
                btnClass += "border-red-500 bg-red-500/20 text-red-400";
              } else {
                btnClass += "border-card opacity-50";
              }

              return (
                <button 
                  key={i}
                  disabled={showResult}
                  onClick={() => setSelected(i)}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          
          {selected !== null && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm leading-relaxed text-emerald-200">
              <span className="font-bold uppercase tracking-wide text-xs block mb-1 opacity-80">Explanation</span>
              {challenge.explanation}
              <button 
                onClick={generateChallenge}
                className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Next Challenge ➡️
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

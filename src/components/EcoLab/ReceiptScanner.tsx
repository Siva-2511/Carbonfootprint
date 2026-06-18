import React, { useState, useRef } from 'react';
import { analyzeImageWithAI } from '../../services/aiLayer';

export function ReceiptScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      setLoading(true);
      setResult(null);

      const prompt = `Analyze this shopping receipt or food image. Extract the purchased items or food components. Then, estimate the associated carbon footprint (in kg CO2e) for each item, and provide a total estimated footprint. Format your response clearly.`;
      
      const analysis = await analyzeImageWithAI(base64, prompt);
      setResult(analysis || 'Failed to analyze the image. Please try again.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        📸 AI Receipt & Meal Scanner
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        Upload a photo of your shopping receipt or a meal. Our Vision AI will extract the items, calculate the calories, and estimate the carbon footprint instantly!
      </p>

      <div 
        className="border-2 border-dashed rounded-xl p-8 text-center transition-all border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer bg-emerald-500/5"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          disabled={loading}
        />
        <div className="text-4xl mb-2">📥</div>
        <p className="text-primary font-semibold">Click to upload an image</p>
        <p className="text-muted text-xs mt-1">Supports JPG, PNG, WEBP</p>
      </div>

      {preview && (
        <div className="mt-6">
          <p className="text-sm text-secondary mb-2 font-semibold">Image Preview:</p>
          <img src={preview} alt="Uploaded receipt or meal" className="w-full max-w-sm rounded-xl border border-border-card shadow-lg" />
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl mt-4">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-emerald-400 text-sm font-medium">Vision AI is scanning and analyzing items...</span>
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 p-5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xl">
          <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            ✨ AI Analysis Complete
          </h3>
          <div className="prose prose-invert prose-sm max-w-none text-secondary whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

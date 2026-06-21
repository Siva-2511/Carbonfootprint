import React, { useId } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'emerald' | 'amber' | 'rose' | 'blue';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
};

const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

export function ProgressBar({ value, max = 100, label, color = 'emerald', showLabel = false, size = 'md', className = '' }: ProgressBarProps) {
  const id = useId();
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const safeColor = pct >= 100 ? 'rose' : pct >= 80 ? 'amber' : color;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showLabel) && (
        <div className="flex justify-between text-sm text-secondary">
          {label && <span id={id}>{label}</span>}
          {showLabel && <span className="metric text-secondary">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={`w-full ${sizeMap[size]} bg-white/10 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-labelledby={label ? id : undefined}
        aria-label={!label ? `${Math.round(pct)}%` : undefined}
      >
        <div
          className={`${sizeMap[size]} ${colorMap[safeColor]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

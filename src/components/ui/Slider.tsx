import React, { useId } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  helperText?: string;
  color?: 'emerald' | 'amber' | 'rose' | 'blue';
  disabled?: boolean;
  formatValue?: (v: number) => string;
}

const trackColors = {
  emerald: 'accent-emerald-500',
  amber: 'accent-amber-500',
  rose: 'accent-rose-500',
  blue: 'accent-blue-500',
};

export function Slider({
  value, onChange, min, max, step = 1, label, unit = '',
  helperText, color = 'emerald', disabled = false, formatValue,
}: SliderProps) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : value.toLocaleString();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="text-sm font-medium text-secondary">
          {label}
        </label>
        <span className="metric text-emerald-400 text-sm" aria-live="polite">
          {displayValue}{unit && ` ${unit}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${displayValue}${unit ? ` ${unit}` : ''}`}
        className={`w-full h-2 rounded-full bg-white/10 ${trackColors[color]} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      <div className="flex justify-between text-xs text-muted">
        <span>{min.toLocaleString()}{unit && ` ${unit}`}</span>
        <span>{max.toLocaleString()}{unit && ` ${unit}`}</span>
      </div>
      {helperText && <p className="text-xs text-muted mt-0.5">{helperText}</p>}
    </div>
  );
}

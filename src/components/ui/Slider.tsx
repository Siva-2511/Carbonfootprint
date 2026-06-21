/**
 * @fileoverview Accessible Slider (range input) component for the CarbonSense UI library.
 * Pairs a native `<input type="range">` with a labelled display of the current value,
 * min/max hints, and an optional helper text line. Supports custom value formatting
 * and colour accent theming.
 */

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

/**
 * Labelled range slider with live value display, min/max hints, and ARIA attributes.
 * The displayed value updates reactively and is announced via `aria-live="polite"`.
 *
 * @param props.value - Current numeric value of the slider.
 * @param props.onChange - Callback invoked with the new numeric value on every change.
 * @param props.min - Minimum allowed value.
 * @param props.max - Maximum allowed value.
 * @param props.step - Increment step size; defaults to `1`.
 * @param props.label - Visible label text and accessible name for the input.
 * @param props.unit - Optional unit string appended to the displayed value (e.g. `'kWh'`).
 * @param props.helperText - Optional explanatory text rendered below the slider track.
 * @param props.color - CSS accent colour for the track thumb; defaults to `'emerald'`.
 * @param props.disabled - When `true`, disables interaction and dims the control.
 * @param props.formatValue - Optional formatter applied to `value` for the live display.
 */
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

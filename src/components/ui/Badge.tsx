/**
 * @fileoverview Reusable Badge component for the CarbonSense UI library.
 * Renders a small inline label with semantic colour variants (success, warning,
 * danger, info, neutral) and two size options, used throughout the app to
 * annotate statuses, impact levels, and metadata.
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  info: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  neutral: 'bg-white/8 text-secondary border border-white/15',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
};

/**
 * Inline badge pill used to surface categorical labels and status indicators.
 *
 * @param props.children - Content rendered inside the badge (text, icons, etc.).
 * @param props.variant - Colour scheme; defaults to `'neutral'`.
 * @param props.size - Padding/border-radius preset; defaults to `'md'`.
 * @param props.className - Additional Tailwind classes merged onto the root `<span>`.
 */
export function Badge({ children, variant = 'neutral', size = 'md', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

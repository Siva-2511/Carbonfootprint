/**
 * @fileoverview Reusable accessible Alert component for the CarbonSense UI library.
 * Renders a colour-coded notification banner supporting success, warning, danger,
 * and info severity levels with an optional dismiss button.
 */

import React from 'react';

interface AlertProps {
  type: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const styles = {
  success: { bg: 'bg-emerald-500/10 border-emerald-500/25', text: 'text-emerald-300', icon: '✅' },
  warning: { bg: 'bg-amber-500/10 border-amber-500/25', text: 'text-amber-300', icon: '⚠️' },
  danger: { bg: 'bg-rose-500/10 border-rose-500/25', text: 'text-rose-300', icon: '🚨' },
  info: { bg: 'bg-blue-500/10 border-blue-500/25', text: 'text-blue-300', icon: 'ℹ️' },
};

/**
 * Displays a contextual alert banner with an icon, optional title, and message.
 * Uses `role="alert"` with `aria-live="assertive"` for danger alerts and
 * `role="status"` with `aria-live="polite"` for all other types.
 *
 * @param props.type - Severity level controlling colour scheme and icon.
 * @param props.title - Optional bold heading rendered above the message.
 * @param props.message - Primary alert text to display.
 * @param props.dismissible - When `true`, renders an ✕ dismiss button (requires `onDismiss`).
 * @param props.onDismiss - Callback fired when the dismiss button is clicked.
 * @param props.className - Additional Tailwind classes to merge onto the root element.
 */
export function Alert({ type, title, message, dismissible, onDismiss, className = '' }: AlertProps) {
  const { bg, text, icon } = styles[type];
  return (
    <div
      role={type === 'danger' ? 'alert' : 'status'}
      aria-live={type === 'danger' ? 'assertive' : 'polite'}
      className={`flex gap-3 p-4 rounded-xl border ${bg} ${className}`}
    >
      <span aria-hidden="true" className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className={`font-medium text-sm font-display ${text}`}>{title}</p>}
        <p className={`text-sm ${text} opacity-90`}>{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className={`flex-shrink-0 ${text} hover:opacity-70 transition-opacity`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

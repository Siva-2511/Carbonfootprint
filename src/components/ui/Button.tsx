import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', style, ...props }, ref) => {
    // Determine dynamic styles based on variant
    let vStyle: React.CSSProperties = {};
    if (variant === 'primary') {
      vStyle = {
        background: 'linear-gradient(135deg, hsl(161,94%,30%), hsl(160,84%,39%))',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 14px rgba(52,211,153,0.25)',
      };
    } else if (variant === 'secondary') {
      vStyle = {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-strong)',
      };
    } else if (variant === 'danger') {
      vStyle = {
        background: 'rgba(244,63,94,0.1)',
        color: '#fb7185',
        border: '1px solid rgba(244,63,94,0.3)',
      };
    } else if (variant === 'ghost') {
      vStyle = {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
      };
    }

    // Determine sizes
    const p = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '10px 20px';
    const br = size === 'sm' ? '8px' : '12px';
    const fs = size === 'lg' ? '16px' : '14px';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontWeight: 600, transition: 'all 0.2s', cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1, padding: p, borderRadius: br, fontSize: fs,
          fontFamily: "'Space Grotesk', sans-serif",
          ...vStyle,
          ...style,
        }}
        className={className}
        {...props}
      >
        {loading && (
          <svg className="animate-spin" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';


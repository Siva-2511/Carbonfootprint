import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

const elevations = {
  sm: 'shadow-sm shadow-black/10',
  md: 'shadow-md shadow-black/20',
  lg: 'shadow-xl shadow-black/30',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', elevation = 'md', as: Tag = 'div', ...props }, ref) => (
    <Tag
      ref={ref}
      className={`card-3d glass-panel rounded-2xl ${elevations[elevation]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
);
Card.displayName = 'Card';

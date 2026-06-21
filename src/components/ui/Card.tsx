/**
 * @fileoverview Reusable Card surface component for the CarbonSense UI library.
 * Provides a glassmorphism-styled container with configurable shadow elevation
 * and a polymorphic `as` prop to render as any HTML element.
 */

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

/**
 * Glassmorphism surface container that wraps content in a styled card panel.
 * Supports ref forwarding, variable shadow depth, and polymorphic rendering
 * via the `as` prop.
 *
 * @param props.children - Content to render inside the card.
 * @param props.className - Additional Tailwind classes merged onto the root element.
 * @param props.elevation - Shadow depth preset; defaults to `'md'`.
 * @param props.as - The HTML element or component to render as; defaults to `'div'`.
 */
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

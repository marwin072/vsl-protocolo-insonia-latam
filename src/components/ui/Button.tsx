import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-surface text-white hover:bg-surface-hover border border-border',
      cta: 'bg-brand-accent text-[#02044F] font-bold shadow-[0_0_20px_rgba(92,138,230,0.3)] hover:shadow-[0_0_35px_rgba(255,244,210,0.5)] transition-all duration-500 ease-out hover:-translate-y-1 group overflow-hidden relative',
      ghost: 'hover:bg-surface hover:text-white',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg py-6',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {variant === 'cta' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#FFF4D2] scale-0 group-hover:scale-[20] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 rounded-full" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[#169A76] text-[#0B0C10] hover:bg-[#148A6A] active:bg-[#11795D]': variant === 'primary',
            'bg-[#14161C] text-[#B8952E] border border-[#B8952E] hover:bg-[#0B0C10]': variant === 'secondary',
            'border border-[#1F222A] bg-transparent hover:bg-[#14161C] text-[#8A9099]': variant === 'outline',
            'hover:bg-[#14161C] text-[#8A9099]': variant === 'ghost',
            'bg-[#991b1b] text-[#fef2f2] hover:bg-[#7f1d1d]': variant === 'danger',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

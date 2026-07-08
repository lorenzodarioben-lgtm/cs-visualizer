import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
};

export function ControlButton({ children, variant = 'secondary', className = '', ...props }: ControlButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600',
  secondary:
    'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent dark:text-slate-300 dark:hover:bg-slate-800',
};

export function ControlButton({ children, variant = 'secondary', className = '', ...props }: ControlButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

const variants = {
  primary: 'border-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500',
  secondary:
    'border-slate-300/80 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800',
  danger: 'border-rose-600 bg-rose-600 text-white shadow-sm hover:bg-rose-500 hover:border-rose-500',
  ghost:
    'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
};

export function ControlButton({ children, variant = 'secondary', className = '', ...props }: ControlButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

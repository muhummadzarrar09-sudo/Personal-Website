import React from 'react';

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Button ───────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-md font-syne tracking-wide select-none';

  const variants: Record<string, string> = {
    primary:
      'bg-accent text-background hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,255,148,0.3)] active:brightness-90',
    ghost:
      'border border-card-border text-foreground hover:border-accent/40 hover:text-accent active:border-accent',
    outline:
      'border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent active:bg-accent/20',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-xs',
    default: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  children: React.ReactNode;
}

export function Card({ className, children, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-card-border rounded-lg transition-all duration-500',
        glow &&
          'hover:border-accent/30 hover:shadow-[0_0_40px_rgba(0,255,148,0.06)] hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'accent' | 'gold' | 'live';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-surface-light text-muted',
    outline: 'border border-card-border text-muted',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    gold: 'bg-gold/10 text-gold border border-gold/20',
    live: 'bg-accent/15 text-accent border border-accent/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-widest rounded-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── Separator ────────────────────────────────────────────────
export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-card-border', className)} />;
}

// ─── Input ────────────────────────────────────────────────────
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full bg-card border border-card-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}

// ─── Textarea ─────────────────────────────────────────────────
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full bg-card border border-card-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300 min-h-[120px] resize-none',
        className
      )}
      {...props}
    />
  );
}

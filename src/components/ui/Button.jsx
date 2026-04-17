import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-[18px] py-[9px]',
    lg: 'text-sm px-6 py-3',
  };

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]',
    secondary: 'bg-white text-text-secondary border border-input-border hover:border-primary hover:text-primary active:scale-[0.98]',
    danger: 'bg-danger text-white hover:bg-red-800 active:scale-[0.98]',
    accent: 'bg-accent text-accent-text hover:bg-yellow-400 active:scale-[0.98]',
    ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted active:scale-[0.98]',
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

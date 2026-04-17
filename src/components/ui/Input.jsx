import clsx from 'clsx';

export function Input({ label, error, prefix, suffix, className, wrapperClassName, ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label className="text-[13px] font-medium text-text-secondary">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={clsx(
            'w-full bg-input-bg border border-input-border rounded-btn px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150',
            'focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)]',
            error && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(197,48,48,0.08)]',
            prefix && 'pl-9',
            suffix && 'pr-9',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className, wrapperClassName, children, ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label className="text-[13px] font-medium text-text-secondary">{label}</label>
      )}
      <select
        className={clsx(
          'w-full bg-input-bg border border-input-border rounded-btn px-3 py-2.5 text-sm text-text-primary transition-all duration-150 appearance-none cursor-pointer',
          'focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)]',
          error && 'border-danger',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div
          className={clsx(
            'w-10 h-5 rounded-full transition-colors duration-200',
            checked ? 'bg-primary' : 'bg-gray-300'
          )}
        />
        <div
          className={clsx(
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}

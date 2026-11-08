import React from 'react';
import { X } from 'lucide-react';

/**
 * Input Component
 * Clean modern text input with optional prefix icon, suffix clear button, and label support.
 */
export const Input = ({
  label,
  value,
  onChange,
  onClear,
  placeholder = '',
  type = 'text',
  icon: Icon = null,
  error = null,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white text-slate-800 placeholder-slate-400 text-sm py-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-400 ${
            Icon ? 'pl-9' : 'pl-3.5'
          } ${onClear && value ? 'pr-9' : 'pr-3.5'} ${
            error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
          } ${className}`}
          {...props}
        />

        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

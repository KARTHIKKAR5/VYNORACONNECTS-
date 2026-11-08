import React from 'react';

/**
 * ToggleSwitch Component
 * Smooth interactive toggle for settings toggles.
 */
export const ToggleSwitch = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className={`flex items-start justify-between gap-4 py-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex-1 pr-2">
        <span className="text-sm font-medium text-slate-800 block">
          {label}
        </span>
        {description && (
          <span className="text-xs text-slate-500 block mt-0.5 leading-normal">
            {description}
          </span>
        )}
      </div>

      <div className="relative inline-flex items-center flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
      </div>
    </label>
  );
};

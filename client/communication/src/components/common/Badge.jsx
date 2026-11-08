import React from 'react';

/**
 * Badge Component
 * Used for unread counters, tags, user roles (Mentor, TA, Team), and status labels.
 */
export const Badge = ({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'count'
  size = 'sm', // 'xs' | 'sm' | 'md'
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    count: 'bg-brand-500 text-white font-semibold shadow-sm',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] rounded-full',
    sm: 'px-2 py-0.5 text-xs rounded-full',
    md: 'px-2.5 py-1 text-xs rounded-md font-medium',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium leading-none whitespace-nowrap ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {children}
    </span>
  );
};

import React from 'react';

/**
 * Avatar Component
 * Displays a student profile picture with fallback initials and an optional online status dot.
 */
export const Avatar = ({
  src,
  alt = 'Student Avatar',
  size = 'md',
  status = null, // 'online' | 'busy' | 'away' | 'offline'
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  // Size mapping
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSize = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white',
    busy: 'bg-rose-500 ring-white',
    away: 'bg-amber-500 ring-white',
    offline: 'bg-slate-400 ring-white',
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return 'VC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover shadow-sm border border-slate-100`}
        />
      ) : (
        <div
          className={`${
            sizeClasses[size] || sizeClasses.md
          } rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 text-white font-medium flex items-center justify-center shadow-sm select-none`}
        >
          {getInitials(alt)}
        </div>
      )}

      {/* Real-time Presence Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ${
            statusSize[size] || statusSize.md
          } ${statusColors[status] || statusColors.offline}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

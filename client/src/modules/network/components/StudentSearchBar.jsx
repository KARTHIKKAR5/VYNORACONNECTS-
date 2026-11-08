import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export function StudentSearchBar({
  value = '',
  onChange = () => {},
  placeholder = 'Search by name, college, branch, or skills...',
  debounceMs = 250,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '14px',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-input"
        style={{
          width: '100%',
          paddingLeft: '40px',
          paddingRight: localValue ? '40px' : '14px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
        }}
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search students"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          style={{
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default StudentSearchBar;


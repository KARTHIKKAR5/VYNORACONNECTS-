import React from 'react';

export function SkillTag({ skill, selected = false, onClick = null, onRemove = null, size = 'md' }) {
  const isClickable = Boolean(onClick);

  return (
    <span
      className={`skill-tag ${selected ? 'selected' : ''} ${size}`}
      onClick={isClickable ? () => onClick(skill) : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(skill);
              }
            }
          : undefined
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
        fontWeight: '500',
        backgroundColor: selected ? 'var(--accent-glow)' : 'var(--bg-elevated)',
        color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
        border: selected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'var(--transition-fast)',
        userSelect: 'none',
      }}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          aria-label={`Remove ${skill}`}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            fontSize: '1rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          &times;
        </button>
      )}
    </span>
  );
}

export default SkillTag;


import React from 'react'

export interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className = '' }: EmptyStateProps): React.ReactElement {
  return (
    <p
      className={`monigo-empty ${className}`}
      style={{
        padding: 'var(--monigo-space-6)',
        textAlign: 'center',
        color: 'var(--monigo-color-muted-fg)',
        fontSize: 'var(--monigo-text-sm)',
      }}
    >
      {message}
    </p>
  )
}

import React from 'react'

export interface ErrorStateProps {
  error: Error
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  error,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: ErrorStateProps): React.ReactElement {
  return (
    <div
      className={`monigo-error ${className}`}
      role="alert"
      style={{ padding: 'var(--monigo-space-6)', textAlign: 'center' }}
    >
      <p style={{ color: 'var(--monigo-color-danger)', marginBottom: 'var(--monigo-space-3)' }}>
        {error.message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: 'var(--monigo-space-2) var(--monigo-space-4)',
            background: 'var(--monigo-color-primary)',
            color: 'var(--monigo-color-primary-fg)',
            border: 'none',
            borderRadius: 'var(--monigo-radius-md)',
            cursor: 'pointer',
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}

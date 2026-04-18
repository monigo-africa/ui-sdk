import React from 'react'

const skeletonRowStyle: React.CSSProperties = {
  height: '1.25rem',
  margin: 'var(--monigo-space-2) 0',
  background: 'var(--monigo-color-muted)',
  borderRadius: 'var(--monigo-radius-sm)',
  animation: 'monigo-pulse 1.5s ease-in-out infinite',
}

export interface SkeletonProps {
  rows?: number
  className?: string
}

export function Skeleton({ rows = 3, className = '' }: SkeletonProps): React.ReactElement {
  return (
    <>
      <style>{`@keyframes monigo-pulse{0%,100%{opacity:.7}50%{opacity:1}}`}</style>
      <div className={`monigo-skeleton ${className}`} aria-busy="true" aria-live="polite">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={skeletonRowStyle} />
        ))}
      </div>
    </>
  )
}

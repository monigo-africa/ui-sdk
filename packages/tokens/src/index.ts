export { createTheme } from './create-theme'
export type { ThemeOptions, ThemeMode, ThemeRadius } from './create-theme'

export const TOKEN_NAMES = [
  'color-primary',
  'color-primary-fg',
  'color-accent',
  'color-accent-fg',
  'color-bg',
  'color-fg',
  'color-muted',
  'color-muted-fg',
  'color-border',
  'color-danger',
  'color-danger-fg',
  'color-success',
  'color-success-fg',
  'color-warning',
  'color-warning-fg',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'space-1',
  'space-2',
  'space-3',
  'space-4',
  'space-5',
  'space-6',
  'space-7',
  'space-8',
  'font-sans',
  'font-mono',
  'text-xs',
  'text-sm',
  'text-md',
  'text-lg',
  'text-xl',
  'text-2xl',
] as const

export type TokenName = (typeof TOKEN_NAMES)[number]

/** CSS variable reference (e.g. `var(--monigo-color-primary)`) for a token. */
export function cssVar(name: TokenName): string {
  return `var(--monigo-${name})`
}

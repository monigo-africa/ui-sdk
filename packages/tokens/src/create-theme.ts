export type ThemeMode = 'light' | 'dark' | 'auto'
export type ThemeRadius = 'sm' | 'md' | 'lg'

export interface ThemeOptions {
  primary: string
  accent: string
  mode?: ThemeMode
  selector?: string
  radius?: ThemeRadius
  font?: string
}

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

const RADIUS_MAP: Record<ThemeRadius, { sm: string; md: string; lg: string }> = {
  sm: { sm: '2px', md: '4px', lg: '6px' },
  md: { sm: '4px', md: '8px', lg: '12px' },
  lg: { sm: '6px', md: '12px', lg: '16px' },
}

const DARK_OVERRIDES = `
[data-monigo-theme='dark'] {
  --monigo-color-bg: #0b1220;
  --monigo-color-fg: #f1f5f9;
  --monigo-color-muted: #1e293b;
  --monigo-color-muted-fg: #94a3b8;
  --monigo-color-border: #334155;
}
`.trim()

export function createTheme(opts: ThemeOptions): string {
  assertHex(opts.primary, 'primary')
  assertHex(opts.accent, 'accent')

  const selector = opts.selector ?? ':root'
  const radii = RADIUS_MAP[opts.radius ?? 'md']
  const lines: string[] = []

  lines.push(`${selector} {`)
  lines.push(`  --monigo-color-primary: ${opts.primary};`)
  lines.push(`  --monigo-color-accent: ${opts.accent};`)
  lines.push(`  --monigo-radius-sm: ${radii.sm};`)
  lines.push(`  --monigo-radius-md: ${radii.md};`)
  lines.push(`  --monigo-radius-lg: ${radii.lg};`)
  if (opts.font) {
    lines.push(`  --monigo-font-sans: ${opts.font};`)
  }
  lines.push(`}`)

  if (opts.mode === 'dark' || opts.mode === 'auto') {
    lines.push('')
    lines.push(DARK_OVERRIDES)
  }

  return lines.join('\n')
}

function assertHex(value: string, field: string): void {
  if (!HEX.test(value)) {
    throw new Error(`@monigo/tokens createTheme: '${field}' must be a hex colour (got '${value}')`)
  }
}

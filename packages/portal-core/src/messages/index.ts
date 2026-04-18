import { en, type MessageCatalog, type MessageKey } from './en'

export type { MessageCatalog, MessageKey }

export const defaultLocale = 'en-US'

const CATALOGS: Record<string, MessageCatalog> = {
  [defaultLocale]: en,
  en,
}

/**
 * Build a message catalog for a locale with optional overrides.
 * Unknown locales fall back to English.
 */
export function createMessages(
  locale: string = defaultLocale,
  overrides?: Partial<MessageCatalog>,
): MessageCatalog {
  const base = CATALOGS[locale] ?? CATALOGS[locale.split('-')[0] ?? ''] ?? en
  return { ...base, ...overrides }
}

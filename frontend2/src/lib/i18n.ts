/**
 * Lightweight translation helper for inline multilingual text.
 *
 * Usage:
 *   txt(selectedDialect, {
 *     hi: 'हिंदी',
 *     mr: 'मराठी',
 *     kn: 'ಕನ್ನಡ',
 *     te: 'తెలుగు',
 *     gu: 'ગુજરાતી',
 *     en: 'English',
 *   })
 */
export function txt(
  dialect: string,
  translations: Partial<Record<string, string>> & { en: string }
): string {
  return translations[dialect] || translations['en'];
}

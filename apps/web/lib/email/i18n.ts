/**
 * Minimal translation helper passed to the `@repo/transactional` templates.
 * Swap this for next-intl / i18next if you need real localisation — the
 * templates only depend on a `t(key, values)` signature.
 */
export type EmailDictionary = Record<string, string>;

export function createTranslator(dict: EmailDictionary) {
  return (key: string, values?: Record<string, string | number | Date>) => {
    let text = dict[key] ?? key;
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        text = text.replaceAll(`{${k}}`, String(v));
      }
    }
    return text;
  };
}

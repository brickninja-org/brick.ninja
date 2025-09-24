import type { Language } from '@brickninja-org/database';

export function localizedUrl(href: string, language: Language) {
  // get base url from env variable on server or html[data-base-url] on client
  const baseUrl = process.env.BRICKNINJA_URL ?? document.documentElement.dataset.baseUrl!;

  const base = new URL(baseUrl);
  base.hostname = `${language}.${base.hostname}`;

  return new URL(href, base).toString();
}

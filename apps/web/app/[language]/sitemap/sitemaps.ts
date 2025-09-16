import type { Language } from '@brickninja-org/database';

import { db } from '@/lib/prisma';
import { getAlternateUrls } from '@/lib/url';

interface SitemapEntry {
  url: string | URL,
  lastmod?: Date,
  alternates?: {
    lang: string,
    href: string | URL,
  }[],
}

interface Sitemap {
  getCount(): number | Promise<number>,
  getEntries(language: Language, skip: number, take: number): SitemapEntry[] | Promise<SitemapEntry[]>,
}

export const pageSize = 20_000;

export const sitemaps: Record<string, Sitemap> = {
  items: {
    getCount() {
      return db.item.count();
    },

    async getEntries(language, skip, take) {
      const items = await db.item.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return items.map((item) => getEntryForUrl(
        language,
        `/items/${item.id}`,
        { lastmod: item.updatedAt },
      ));
    }
  },
  static: {
    getCount() {
      // always returning 1 is okay because 1 page will always be enough for all static pages
      return 1;
    },

    getEntries(language) {
      return [
        '/',
        '/status',
        '/status/jobs',
        '/status/api',
        '/login',
        '/review',
      ].map((page) => getEntryForUrl(language, page));
    }
  },
};

function getEntryForUrl(currentLanguage: Language, pathname: string, additionalProps: Omit<SitemapEntry, 'url' | 'alternates'> = {}): SitemapEntry {
  const alternates = getAlternateUrls(pathname, currentLanguage);

  return {
    url: alternates.canonical,
    alternates: Object.entries(alternates.languages).map(([lang, href]) => ({ lang, href })),
    ...additionalProps,
  };
}

export const getSitemapsForType = (baseUrl: string) => async (type: keyof typeof sitemaps) => {
  const count = await sitemaps[type].getCount();

  const pageCount = Math.ceil(count / pageSize);
  const pages = Array(pageCount).fill(undefined);

  const sitemapXml = pages
    .map((_, page) => `<sitemap><loc>${baseUrl}/${type}/${page}</loc></sitemap>`)
    .join('');

  return sitemapXml;
};

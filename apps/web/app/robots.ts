import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/url';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sitemapUrl = new URL('/sitemap', await absoluteUrl('/sitemap'));

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth',
      ],
      crawlDelay: 5,
    }, {
      userAgent: ['AhrefsBot', 'barkrowler', 'BLEXBot'],
      crawlDelay: 60,
    }],
    sitemap: sitemapUrl.toString(),
  };
}

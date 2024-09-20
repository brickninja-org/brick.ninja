import type { MetadataRoute } from 'next';

import { getCurrentUrl } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = new URL('/sitemap', getCurrentUrl());

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth',
      ],
      crawlDelay: 5,
    }, {
      userAgent: ['barkrowler'],
      crawlDelay: 60,
    }],
    sitemap: sitemapUrl.toString(),
  };
}

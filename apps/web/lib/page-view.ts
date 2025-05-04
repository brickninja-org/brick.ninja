import { headers } from 'next/headers';
import { cache } from 'react';
import { db } from './prisma';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  const header = await headers();
  // don't log page views for bots and prefetch
  if (header.get('x-bn-is-bot') === '1' || header.get('x-bn-is-prefetch') === '1' || header.get('Next-Router-Prefetch') === '1' || header.get('X-Next-Router-Prefetch') === '1') {
    return;
  }

  // get AS number (header set by cloudflare in prod)
  // const asn = parseInt(header.get('x-asn')!) || null;

  await db.pageView.create({ data: { page, pageId }});
});

import { NextResponse } from 'next/server';

import { Language } from '@brickninja-org/database';

import { getCurrentUrl } from '@/lib/url';

export async function GET() {
  const currentUrl = await getCurrentUrl();
  const protocol = currentUrl.protocol;

  return NextResponse.json({
    id: '/',
    name: 'brick.ninja',
    short_name: 'brick.ninja',
    start_url: '/',
    display: 'standalone',
    scope_extensions: Object.values(Language).map((language) => ({ origin: `${protocol}//${language}.${process.env.BRICKNINJA_NEXT_DOMAIN}` })),
  }, {
    headers: {
      'Content-Type': 'application/manifest+json',
    }
  });
}

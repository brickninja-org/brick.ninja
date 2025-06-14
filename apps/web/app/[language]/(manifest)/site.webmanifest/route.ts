import { NextResponse } from 'next/server';

import { Language } from '@brickninja-org/database';

import { getCurrentUrl } from '@/lib/url';

export async function GET() {
  const currentUrl = await getCurrentUrl();
  const protocol = currentUrl.protocol;

  return NextResponse.json({
    id: '/',
    name: 'brick-catalog.eu',
    short_name: 'brick-catalog.eu',
    start_url: '/',
    theme_color: '#b7000d',
    background_color: '#ffffff',
    display: 'standalone',
    scope_extensions: Object.values(Language).map((language) => ({ type: 'origin', origin: `${protocol}//${language}.${process.env.BRICKNINJA_NEXT_DOMAIN}` })),
  }, {
    headers: {
      'Content-Type': 'application/manifest+json',
    }
  });
}

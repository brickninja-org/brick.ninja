import { NextResponse } from 'next/server';

import { Language } from '@brickninja-org/database';

import { getBaseUrl } from '@/lib/url';

export function GET() {
  return NextResponse.json({
    id: '/',
    name: 'brick-catalog.eu',
    short_name: 'brick-catalog.eu',
    start_url: '/',
    theme_color: '#b7000d',
    background_color: '#ffffff',
    display: 'standalone',
    scope_extensions: Object.values(Language).map((language) => ({ type: 'origin', origin: getBaseUrl(language).origin })),
  }, {
    headers: {
      'Content-Type': 'application/manifest+json',
    }
  });
}

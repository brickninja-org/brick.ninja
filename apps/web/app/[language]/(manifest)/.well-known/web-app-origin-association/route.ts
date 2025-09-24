import { NextResponse } from 'next/server';
import { Language } from '@brickninja-org/database';

import { getBaseUrl } from '@/lib/url';

export function GET() {
  return NextResponse.json(
    Object.fromEntries(
      Object.values(Language).map((language) => [
        getBaseUrl(language).origin,
        { scope: '/' },
      ]),
    ),
  );
}

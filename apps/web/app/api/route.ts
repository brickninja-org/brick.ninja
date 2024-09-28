import { getCurrentUrl } from '@/lib/url';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const baseDomain = process.env.BRICKNINJA_NEXT_DOMAIN!;

export function GET() {
  const language = headers().get('x-bn-lang');

  const documentation = getCurrentUrl();
  documentation.hostname = baseDomain;
  documentation.pathname = documentation.pathname.replace('/api', '');

  return NextResponse.json({ api: true, language, documentation });
}

import { getLanguage } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const baseDomain = process.env.BRICKNINJA_NEXT_DOMAIN!;

export async function GET() {
  const language = await getLanguage();

  const documentation = await getCurrentUrl();
  documentation.hostname = baseDomain;
  documentation.pathname = '/dev/api';

  return NextResponse.json({ api: true, language, documentation });
}

import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { getCurrentUrl } from '@/lib/url';

import { getSitemapsForType, sitemaps } from '../sitemaps';

export async function GET(_: NextRequest, { params: { type }}: { params: { type: string }}) {
  if(!(type in sitemaps)) {
    notFound();
  }

  const url = getCurrentUrl();
  url.pathname = '/sitemap';

  const sitemapXml = await getSitemapsForType(url.toString())(type);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}

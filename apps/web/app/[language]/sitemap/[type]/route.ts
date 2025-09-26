import type { RouteHandler } from '@/lib/next';

import { notFound } from 'next/navigation';

import { absoluteUrl } from '@/lib/url';

import { getSitemapsForType, sitemaps } from '../sitemaps';

export const GET: RouteHandler<{ type: string }> = async (_, { params }) => {
  const { type } = await params;

  if(!(type in sitemaps)) {
    notFound();
  }

  const url = await absoluteUrl('/sitemap');
  const sitemapXml = await getSitemapsForType(url.toString())(type);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
};

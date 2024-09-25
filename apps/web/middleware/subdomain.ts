import { NextResponse } from 'next/server';

import { Language } from '@brickninja-org/database';

import type { NextMiddleware } from './types';

type Subdomain = string | 'api';

const validSubdomains: Subdomain[] = ['api', ...Object.values(Language)];
const baseDomain = process.env.BRICKNINJA_NEXT_DOMAIN;

declare module './types' {
  interface NextMiddlewareData {
    subdomain: Subdomain;
  }
}

export const subdomainMiddleware: NextMiddleware = (request, next, data) => {
  const url = data.url;

  if (!url) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // find the subdomain by parsing the hostname
  const subdomain = validSubdomains.find((subdomain) => url.hostname === `${subdomain}.${baseDomain}`);
  data.subdomain = subdomain;

  return next(request);
};

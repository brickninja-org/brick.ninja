import { NextResponse } from 'next/server';

import { Language } from '@brickninja-org/database';

import type { NextMiddleware } from './types';

const languages = Object.values(Language);
const baseDomain = process.env.BRICKNINJA_NEXT_DOMAIN;
const regex = new RegExp(`https?://(${languages.join('|')})\\.${baseDomain?.replace('.', '\\.')}`);

export const corsMiddleware: NextMiddleware = async (request, next, data) => {
  // skip this middleware for API
  if (data.subdomain === 'api') {
    return next(request);
  }

  const origin = request.headers.get('Origin');

  // allow the request if the origin is not set (no CORS request)
  // or if it matches the baseDomain
  const isAllowed = !origin || origin.match(regex);

  if (!isAllowed) {
    console.log('Blocked CORS request.');
    return new NextResponse('', { status: 400 });
  }

  const response = await next(request);

  if (isAllowed && origin) {
    response.headers.append('Access-Control-Allow-Origin', origin);

    // `Vary: Origin` is required, because otherwise `Access-Control-Allow-Origin` is cached for wrong origins
    // nextjs currently doesn't support setting `Vary` in middleware (https://github.com/vercel/next.js/issues/48480)
    // so every relevant endpoint needs to set `Vary: Origin` on the response.
    response.headers.append('Vary', 'Origin');
  }

  return response;
};

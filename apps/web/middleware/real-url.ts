import type { NextMiddleware } from './types';

import { getUrlFromRequest } from '@/lib/url';

declare module './types' {
  interface NextMiddlewareData {
    url: URL;
  }
}

export const realUrlMiddleware: NextMiddleware = (request, next, data) => {
  // get original url before any proxies from request
  const url = getUrlFromRequest(request);

  // append url to middleware data and request
  data.url = url;
  request.headers.append('x-bn-real-url', url.toString());

  return next(request);
};

import { SessionCookieName } from '@/lib/auth/cookie';
import type { NextMiddleware } from './types';

export const sessionMiddleware: NextMiddleware = (request, next) => {
  // set user session based on cookie
  const cookie = request.cookies.get(SessionCookieName);

  if (cookie) {
    request.headers.set('x-bn-session', cookie.value);
  }

  return next(request);
};

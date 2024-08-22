import { NextResponse, type NextRequest } from 'next/server';

import type { NextMiddleware } from './middleware/types';

import { realUrlMiddleware } from './middleware/real-url';
import { subdomainMiddleware } from './middleware/subdomain';
import { languageMiddleware } from './middleware/locale';
import { rewriteMiddleware } from './middleware/rewrite';
import { corsMiddleware } from './middleware/cors';
import { contentSecurityPolicyMiddleware } from './middleware/content-security-policy';
import { healthMiddleware } from 'middleware/health';

export async function middleware(request: NextRequest) {
  const middlewares: NextMiddleware[] = [
    healthMiddleware,
    realUrlMiddleware,
    subdomainMiddleware,
    corsMiddleware,
    contentSecurityPolicyMiddleware,
    languageMiddleware,
    rewriteMiddleware,
  ];

  const data = {};

  let index = 0;
  const next = async (request: NextRequest) => {
    if (index < middlewares.length) {
      return await middlewares[index++](request, next, data);
    }

    return NextResponse.next({ request });
  };

  const response = await next(request);

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|android-chrome-[^/]+.png|apple-touch-icon.png|browserconfig.xml|favicon-[^/]+.png|mstile-[^/]+.png|safari-pinned-tab.svg|maskable_icon_[^/]+.png).*)',
};

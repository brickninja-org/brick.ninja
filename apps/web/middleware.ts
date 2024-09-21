import { NextResponse, type NextRequest } from 'next/server';

import type { NextMiddleware } from './middleware/types';

import { contentSecurityPolicyMiddleware } from './middleware/content-security-policy';
import { corsMiddleware } from './middleware/cors';
import { healthMiddleware } from 'middleware/health';
import { languageMiddleware } from './middleware/language';
import { logMiddleware } from 'middleware/log';
import { realUrlMiddleware } from './middleware/real-url';
import { rewriteMiddleware } from './middleware/rewrite';
import { sessionMiddleware } from 'middleware/session';
import { subdomainMiddleware } from './middleware/subdomain';
import { userAgentMiddleware } from 'middleware/user-agent';
import { apiKeyMiddleware } from 'middleware/api-key';

export async function middleware(request: NextRequest) {
  const middlewares: NextMiddleware[] = [
    logMiddleware,
    healthMiddleware,
    realUrlMiddleware,
    subdomainMiddleware,
    corsMiddleware,
    contentSecurityPolicyMiddleware,
    languageMiddleware,
    userAgentMiddleware,
    sessionMiddleware,
    apiKeyMiddleware,
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

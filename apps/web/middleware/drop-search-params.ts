import { NextResponse } from 'next/server';

import type { NextMiddleware } from './types';

const dropSearchParams = [
  'showSimilar',
];

export const dropSearchParamsMiddleware: NextMiddleware = (request, next, data) => {
  const url = data.url;

  if (!url) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  if (dropSearchParams.some((param) => url.searchParams.has(param))) {
    const redirectUrl = new URL(url);
    dropSearchParams.forEach((param) => redirectUrl.searchParams.delete(param));

    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  return next(request);
};

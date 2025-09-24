import type { NextMiddleware } from './types';

import { Language } from '@brickninja-org/database';

import { getBaseUrl } from '@/lib/url';

const languageSubdomains = [...Object.values(Language)];

export const contentSecurityPolicyMiddleware: NextMiddleware = async (request, next, data) => {
  const subdomain = data.subdomain;

  // skip CSP for API (api.brick.ninja)
  if (subdomain === 'api') {
    return next(request);
  }

  // generate nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // generate list of alternate language domains
  const alternateLanguageHosts = languageSubdomains
    .filter((language) => language !== subdomain)
    .map((language) => getBaseUrl(language).host);

  // construct the CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV !== 'production' ? '\'unsafe-eval\'' : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' images.brickset.com cdn.rebrickable.com www.lego.com;
    connect-src 'self' ${alternateLanguageHosts.join(' ')} brickset.com rebrickable.com bn2me.vercel.app brick-ninja-api.vercel.app api.iconify.design api.unisvg.com api.simplesvg.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ');

  // set x-nonce and CSP for internal request
  request.headers.set('X-Nonce', nonce);
  request.headers.set('Content-Security-Policy', cspHeader);

  // get response
  const response = await next(request);

  // set outgoing CSP and Reporting headers
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
};

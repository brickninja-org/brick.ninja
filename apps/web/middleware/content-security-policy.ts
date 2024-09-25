import { Language } from '@brickninja-org/database';

import type { NextMiddleware } from './types';

const baseDomain = process.env.BRICKNINJA_NEXT_DOMAIN;
const languageSubdomains = [...Object.values(Language)];

export const contentSecurityPolicyMiddleware: NextMiddleware = async (request, next, data) => {
  const url = data.url;
  const subdomain = data.subdomain;

  // skip CSP for API (api.brick.ninja)
  if (subdomain === 'api') {
    return next(request);
  }

  // generate nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // set port if its not a default port (for local development) including `:`
  const portSuffix = url?.port ? `:${url.port}` : '';

  // generate list of alternate language domains
  const alternateLanguageDomains = languageSubdomains
    .filter((language) => language !== subdomain)
    .map((language) => `${language}.${baseDomain}${portSuffix}`);

  // construct the CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV !== 'production' ? '\'unsafe-eval\'' : ''};
    style-src 'self' fonts.googleapis.com ${process.env.NODE_ENV !== 'production' ? '\'unsafe-inline\'' : ''};
    img-src 'self' icons-bn.brickninja-cdn.com images.brickset.com lego.com;
    connect-src 'self' ${alternateLanguageDomains.join(' ')} brickset.com;
    font-src 'self' static fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    report-uri https://brickninja.report-uri.com/r/d/csp/enforce;
    report-to default;
  `.replace(/\s{2,}/g, ' ');

  // set x-nonce and CSP for internal request
  request.headers.set('X-Nonce', nonce);
  request.headers.set('Content-Security-Policy', cspHeader);

  // get response
  const response = await next(request);

  // set outgoing CSP and Reporting headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Reporting-Endpoints', 'default="https://brickninja.report-uri.com/a/d/g"');

  return response;
};

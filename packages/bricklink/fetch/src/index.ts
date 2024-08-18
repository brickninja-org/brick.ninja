import type { EndpointType, KnownEndpoint, OptionsByEndpoint } from '@bricklink-api/types/endpoints';
import type { SchemaVersion } from '@bricklink-api/types/schema';

/*
type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

// if OptionsByEndpoint<Url> has no required keys, make the options parameter optional
type Args<Url extends string, Schema extends SchemaVersion> = RequiredKeys<OptionsByEndpoint<Url>> extends never
  ? [endpoint: Url, options?: FetchBricklinkApiOptions<Schema> & OptionsByEndpoint<Url> & FetchOptions]
  : [endpoint: Url, options: FetchBricklinkApiOptions<Schema> & OptionsByEndpoint<Url> & FetchOptions];

export async function fetchBricklinkApi<
  Url extends KnownEndpoint | (string & object),
  Schema extends SchemaVersion = undefined
>(
  ...[endpoint, options]: Args<Url, Schema>
): Promise<EndpointType<Url, Schema>> {
  const url = new URL(endpoint, 'https://api.bricklink.com/');	

  if (options.schema) {
    url.searchParams.set('v', options.schema);
  }

  // build oAuth headers
  const headers = new Headers();
  headers.set('Authorization', `OAuth realm="" oauth_consumer_key="${process.env.BRICKLINK_CONSUMER_KEY}" oauth_token="${process.env.BRICKLINK_TOKEN}" oauth_signature_method="HMAC-SHA1" oauth_timestamp="${Date.now()}" oauth_nonce="${Math.random()}" oauth_version="1.0" oauth_signature="${process.env.BRICKLINK_SIGNATURE}"`);

  // build request
  let request = new Request(url, {
    redirect: 'manual',

    // set signal and cache from options
    signal: options.signal,
    cache: options.cache,

    // set headers
    headers,
  });

  // if there is an onRequest handler registered, let it modify the request
  if (options.onRequest) {
    request = await options.onRequest(request);

    if (!(request instanceof Request)) {
      throw new Error('onRequest has to return a Request');
    }
  }

  // call the API
  const response = await fetch(request);

  // call onResponse handler
  await options.onResponse?.(response);

  // check if the response is JSON (`application/json; charset=utf-8`)
  const isJson = response.headers.get('content-type')?.startsWith('application/json');

  // check if the response is an error
  if (!response.ok) {
    // if the response is JSON, it might have more details in the `text`prop
    if (isJson) {
      const error: unknown = await response.json();

      if (typeof error === 'object' && 'text' in error && typeof error.text === 'string') {
        throw new BricklinkError(`The Bricklink API call to '${url.toString()}' returned ${response.status} ${response.statusText}: ${error.text}`, response);
      }
    }

    // otherwise just throw error with the status code
    throw new BricklinkError(`The Bricklink API call to '${url.toString()}' returned ${response.status} ${response.statusText}`, response);
  }

  // if the response is not JSON, throw an error
  if (!isJson) {
    throw new BricklinkError(`The Bricklink API call to '${url.toString()}' did not respond with a JSON esponse`, response);
  }

  // parse the JSON response
  const json = await response.json();

  // TODO: catch more errors

  return json;
}
  */

export type FetchBricklinkApiOptions<Schema extends SchemaVersion> = {
  /** The schema to use when making the API request */
  schema?: Schema;

  /** onRequest handler allows to modify the request made to the Bricklink API. */
  onRequest?: (request: Request) => Request | Promise<Request>;

  /**
   * onResponse handler. Called for all responses, successful or not.
   * Make sure to clone the response in case of consuming the body.
   */
  onResponse?: (response: Response) => void | Promise<void>;
};

export type FetchOptions = {
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal */
  signal?: AbortSignal,

  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache */
  cache?: RequestCache,
};

export class BricklinkError extends Error {
  constructor(message: string, public response: Response) {
    super(message);
    this.name = 'BricklinkError';
  }
}

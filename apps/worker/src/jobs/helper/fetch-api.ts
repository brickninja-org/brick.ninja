import type { EndpointType, OptionsByEndpoint } from '@brickset-api/types/endpoints';

import chalk from 'chalk';
import { fetchBricksetApi, type FetchOptions } from '@brickset-api/fetch';

import { db } from '../../db';

const fetchOptions: FetchOptions = {};

type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

type Args<Url extends string> = RequiredKeys<OptionsByEndpoint<Url>> extends never
  ? [url: Url, options?: OptionsByEndpoint<Url>]
  : [url: Url, options: OptionsByEndpoint<Url>];

  export async function fetchApi<Url extends (string & {})>(
  ...[url, options]: Args<Url>
): Promise<EndpointType<Url>> {
  const startTime = performance.now();
  const [endpoint, queryParameters = ''] = url.split('?');
  let rawResponse: Response | undefined = undefined as Response | undefined;

  try {
    return await fetchBricksetApi<Url>(url, {
      onResponse: (r) => { rawResponse = r; },
      ...(options as OptionsByEndpoint<Url>),
      ...fetchOptions,
    });
  } finally {
    const responseTimeMs = performance.now() - startTime;

    const endpointWithQueryKeys = endpoint + (queryParameters ? '?' + [...new URLSearchParams(queryParameters).keys()].join('&') : '');
    const status = rawResponse?.ok ? chalk.green(rawResponse.status) : chalk.red(rawResponse?.status ?? 'error');
    console.log(`> ${chalk.magenta(endpointWithQueryKeys)} ${status} ${chalk.gray(`(${Math.round(responseTimeMs)} ms)`)}`);

    await db.apiRequest.create({
      data: {
        endpoint,
        queryParameters,
        responseTimeMs,
        status: rawResponse?.status ?? -1,
        statusText: rawResponse?.statusText ?? 'error',
      }
    });
  }
}

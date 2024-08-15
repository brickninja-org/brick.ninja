import type { EndpointType, KnownEndpoint, OptionsByEndpoint } from '@bricklink-api/types/endpoints';
import type { SchemaVersion } from '@bricklink-api/types/schema';
type RequiredKeys<T> = {
    [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];
type Args<Url extends string, Schema extends SchemaVersion> = RequiredKeys<OptionsByEndpoint<Url>> extends never ? [endpoint: Url, options?: FetchBricklinkApiOptions<Schema> & OptionsByEndpoint<Url> & FetchOptions] : [endpoint: Url, options: FetchBricklinkApiOptions<Schema> & OptionsByEndpoint<Url> & FetchOptions];
export declare function fetchBricklinkApi<Url extends KnownEndpoint | (string & object), Schema extends SchemaVersion = undefined>(...[endpoint, options]: Args<Url, Schema>): Promise<EndpointType<Url, Schema>>;
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
    signal?: AbortSignal;
    /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache */
    cache?: RequestCache;
};
export declare class BricklinkError extends Error {
    response: Response;
    constructor(message: string, response: Response);
}
export {};

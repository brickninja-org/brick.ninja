import type { SchemaVersion } from '@bricklink-api/types/schema';
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

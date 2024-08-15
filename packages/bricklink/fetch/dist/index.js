var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function fetchBricklinkApi() {
    return __awaiter(this, arguments, void 0, function* (...[endpoint, options]) {
        var _a, _b;
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
            request = yield options.onRequest(request);
            if (!(request instanceof Request)) {
                throw new Error('onRequest has to return a Request');
            }
        }
        // call the API
        const response = yield fetch(request);
        // call onResponse handler
        yield ((_a = options.onResponse) === null || _a === void 0 ? void 0 : _a.call(options, response));
        // check if the response is JSON (`application/json; charset=utf-8`)
        const isJson = (_b = response.headers.get('content-type')) === null || _b === void 0 ? void 0 : _b.startsWith('application/json');
        // check if the response is an error
        if (!response.ok) {
            // if the response is JSON, it might have more details in the `text`prop
            if (isJson) {
                const error = yield response.json();
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
        const json = yield response.json();
        // TODO: catch more errors
        return json;
    });
}
export class BricklinkError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = 'BricklinkError';
    }
}

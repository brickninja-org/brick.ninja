export class BricklinkError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = 'BricklinkError';
    }
}

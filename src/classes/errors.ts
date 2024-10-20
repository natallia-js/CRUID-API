export enum ROUTING_ERROR_CODES {
    requestToNonExistingEndpoint = -1,
}

export class RoutingError extends Error {
    public readonly errorCode: ROUTING_ERROR_CODES;
    constructor(errorCode: ROUTING_ERROR_CODES, message: string) {
        super(message);
        this.errorCode = errorCode;
    }
}

export class NonExistingEndpointRequestError extends RoutingError {
    constructor() {
        super(ROUTING_ERROR_CODES.requestToNonExistingEndpoint, 'Request to non-existing endpoint');
    }
}

// ------------------

export enum USER_ERROR_CODES {
    userNotFound = -1,
    wrongUserData = -2,
}

export class UserError extends Error {
    public readonly errorCode: USER_ERROR_CODES;
    constructor(errorCode: USER_ERROR_CODES, message: string) {
        super(message);
        this.errorCode = errorCode;
    }
}


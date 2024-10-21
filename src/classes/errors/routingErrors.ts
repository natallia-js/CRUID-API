export enum ROUTING_ERROR_CODES {
  requestToNonExistingEndpoint = -1,
  requestMethodNotSupported = -2,
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
    super(
      ROUTING_ERROR_CODES.requestToNonExistingEndpoint,
      "Request to non-existing endpoint",
    );
  }
}

export class RequestMethodNotSupportedError extends RoutingError {
  constructor() {
    super(
      ROUTING_ERROR_CODES.requestMethodNotSupported,
      "Request method is not supported",
    );
  }
}

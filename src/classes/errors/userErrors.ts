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

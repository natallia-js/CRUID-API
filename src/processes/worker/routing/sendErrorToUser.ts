import { ServerResponse } from "node:http";
import sendResponseToUser from "./sendResponseToUser";
import {
  RoutingError,
  ROUTING_ERROR_CODES,
} from "@classes/errors/routingErrors";
import { UserError, USER_ERROR_CODES } from "@classes/errors/userErrors";

const sendErrorToUser = (error: any, res: ServerResponse) => {
  if (error instanceof UserError) {
    switch (error.errorCode) {
      case USER_ERROR_CODES.userNotFound:
        sendResponseToUser(res, error.message, null, 404);
        break;
      case USER_ERROR_CODES.wrongUserData:
        sendResponseToUser(res, error.message, null, 400);
        break;
      default:
        sendResponseToUser(res, error.message, null, 500);
        break;
    }
  } else if (error instanceof RoutingError) {
    switch (error.errorCode) {
      case ROUTING_ERROR_CODES.requestToNonExistingEndpoint:
      case ROUTING_ERROR_CODES.requestMethodNotSupported:
        sendResponseToUser(res, error.message, null, 404);
        break;
      default:
        sendResponseToUser(res, error.message, null, 500);
        break;
    }
  } else {
    sendResponseToUser(res, error.message, null, 500);
  }
};

export default sendErrorToUser;

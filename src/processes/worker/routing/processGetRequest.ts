import { IncomingMessage, ServerResponse } from "node:http";
import getReqURLNormalized, { getReqRenormalized } from "./getReqURLNormalized";
import getURLParam from "./getURLParam";
import { NonExistingEndpointRequestError } from "@classes/errors/routingErrors";
import { EventEmitter } from "node:events";
import UserActions from "./userActions";

function processGetRequest(
  req: IncomingMessage,
  res: ServerResponse,
  baseUrl: string,
  eventEmitter: EventEmitter,
) {
  const reqUrl = getReqURLNormalized(req);

  if (reqUrl?.startsWith(baseUrl)) {
    if (reqUrl === baseUrl) {
      eventEmitter.emit(
        UserActions.getAllUsers,
        {
          reqMethod: req.method,
          res,
        },
        [],
      );
    } else {
      const userId = getURLParam(baseUrl, getReqRenormalized(reqUrl));
      eventEmitter.emit(
        UserActions.getUser,
        {
          userId,
          reqMethod: req.method,
          res,
        },
        [],
      );
    }
  } else {
    throw new NonExistingEndpointRequestError();
  }
}

export default processGetRequest;

import { IncomingMessage, ServerResponse } from "node:http";
import { NonExistingEndpointRequestError } from "@classes/errors/routingErrors";
import { EventEmitter } from "node:events";
import UserActions from "./userActions";
import getReqURLNormalized, { getReqRenormalized } from "./getReqURLNormalized";
import getURLParam from "./getURLParam";

function processDeleteRequest(
  req: IncomingMessage,
  res: ServerResponse,
  baseUrl: string,
  eventEmitter: EventEmitter,
) {
  let reqUrl = getReqURLNormalized(req);

  if (reqUrl?.startsWith(baseUrl)) {
    if (reqUrl === baseUrl) {
      eventEmitter.emit(
        UserActions.delAllUsers,
        {
          reqMethod: req.method,
          res,
        },
        [],
      );
    } else {
      reqUrl = getReqRenormalized(reqUrl);
      const userId = getURLParam(baseUrl, reqUrl);
      eventEmitter.emit(
        UserActions.delUser,
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

export default processDeleteRequest;

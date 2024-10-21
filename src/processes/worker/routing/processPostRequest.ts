import { IncomingMessage, ServerResponse } from "node:http";
import getReqURLNormalized from "./getReqURLNormalized";
import { NonExistingEndpointRequestError } from "@classes/errors/routingErrors";
import { EventEmitter } from "node:events";
import UserActions from "./userActions";

function processPostRequest(
  req: IncomingMessage,
  res: ServerResponse,
  baseUrl: string,
  eventEmitter: EventEmitter,
) {
  const reqUrl = getReqURLNormalized(req);

  if (reqUrl === baseUrl) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const bodyData = JSON.parse(body);
        eventEmitter.emit(
          UserActions.addUser,
          {
            newUserData: bodyData,
            reqMethod: req.method,
            res,
          },
          [],
        );
      } catch (error: any) {
        req.destroy(error);
      }
    });
  } else {
    throw new NonExistingEndpointRequestError();
  }
}

export default processPostRequest;

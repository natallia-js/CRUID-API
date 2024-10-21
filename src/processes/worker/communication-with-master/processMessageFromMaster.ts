import {
  ActionData,
  ErrorData,
  actionsSentToMaster,
} from "@processes/worker/communication-with-master/sendUserMessageToMaster";
import sendResponseToUser from "@processes/worker/routing/sendResponseToUser";
import sendErrorToUser from "@processes/worker/routing/sendErrorToUser";
import {
  RoutingError,
  NonExistingEndpointRequestError,
  RequestMethodNotSupportedError,
} from "@classes/errors/routingErrors";
import { ActionSentToMaster } from "@classes/ActionsSentToMaster";
import { UserError } from "@classes/errors/userErrors";

function getErrorClassObject(error: ErrorData) {
  switch (error?.typeName) {
    case "RoutingError":
      return new RoutingError(error.code, error.message);
    case "NonExistingEndpointRequestError":
      return new NonExistingEndpointRequestError();
    case "RequestMethodNotSupportedError":
      return new RequestMethodNotSupportedError();
    case "UserError":
      return new UserError(error.code, error.message);
    default:
      return new Error(error.message);
  }
}

process.on("message", (message: string) => {
  const messageFromMaster: ActionData = JSON.parse(message);
  const actionSentToMaster: ActionSentToMaster | undefined =
    actionsSentToMaster.getAction(messageFromMaster.actionId);
  if (!actionSentToMaster) return;
  if (messageFromMaster.error) {
    sendErrorToUser(
      getErrorClassObject(messageFromMaster.error),
      actionSentToMaster.res,
    );
  } else {
    sendResponseToUser(
      actionSentToMaster.res,
      messageFromMaster.data,
      actionSentToMaster.reqMethod,
    );
  }
});

import { ServerResponse } from "node:http";
import { v4 as uuidv4 } from "uuid";
import ActionsSentToMaster from "@classes/ActionsSentToMaster";

export type ErrorData = {
  code: number;
  message: string;
  typeName: string;
};

export type ActionData = {
  actionId: string;
  action: string;
  data: any;
  error: ErrorData | null;
};

export const actionsSentToMaster = new ActionsSentToMaster();

function generateActionId(): string {
  return uuidv4();
}

function sendUserMessageToMaster(
  action: string,
  data: object | null,
  reqMethod: string,
  res: ServerResponse,
) {
  if (!process.send) return;
  const userAction: ActionData = {
    actionId: generateActionId(),
    action,
    data,
    error: null,
  };
  actionsSentToMaster.addAction({
    actionId: userAction.actionId,
    reqMethod,
    res,
  });
  process.send(JSON.stringify(userAction));
}

export default sendUserMessageToMaster;

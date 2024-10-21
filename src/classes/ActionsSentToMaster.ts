import { ServerResponse } from "node:http";

export type ActionSentToMaster = {
  actionId: string;
  reqMethod: string;
  res: ServerResponse;
};

class ActionsSentToMaster {
  private data: ActionSentToMaster[];
  constructor() {
    this.data = [];
  }
  addAction(action: ActionSentToMaster) {
    this.data.push(action);
  }
  deleteAction(actionId: string) {
    const actionIndex = this.data.findIndex((el) => el.actionId === actionId);
    if (actionIndex >= 0) {
      this.data.splice(actionIndex, 1);
    }
  }
  getAction(actionId: string) {
    return this.data.find((el) => el.actionId === actionId);
  }
}

export default ActionsSentToMaster;

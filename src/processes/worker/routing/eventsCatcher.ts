import { EventEmitter } from "node:events";
import { Users } from "@classes/users";
import UserActions from "./userActions";
import sendErrorToUser from "./sendErrorToUser";
import sendResponseToUser from "./sendResponseToUser";
import sendUserMessageToMaster from "@processes/worker/communication-with-master/sendUserMessageToMaster";

const inClusterMode = Boolean(process.env.MULTI);
const eventEmitter = new EventEmitter();

eventEmitter.on(
  UserActions.addUser,
  async ({ newUserData, reqMethod, res }) => {
    try {
      if (!inClusterMode) {
        const newUser = await Users.addUser(newUserData);
        sendResponseToUser(res, newUser, reqMethod, null);
      } else {
        sendUserMessageToMaster(
          UserActions.addUser,
          newUserData,
          reqMethod,
          res,
        );
      }
    } catch (error: any) {
      sendErrorToUser(error, res);
    }
  },
);

eventEmitter.on(UserActions.getAllUsers, async ({ reqMethod, res }) => {
  try {
    if (!inClusterMode) {
      const allUsers = await Users.getAllUsers();
      sendResponseToUser(res, allUsers, reqMethod, null);
    } else {
      sendUserMessageToMaster(UserActions.getAllUsers, null, reqMethod, res);
    }
  } catch (error: any) {
    sendErrorToUser(error, res);
  }
});

eventEmitter.on(UserActions.getUser, async ({ userId, reqMethod, res }) => {
  try {
    if (!inClusterMode) {
      const user = await Users.getUserById(userId);
      sendResponseToUser(res, user, reqMethod, null);
    } else {
      sendUserMessageToMaster(UserActions.getUser, userId, reqMethod, res);
    }
  } catch (error: any) {
    sendErrorToUser(error, res);
  }
});

eventEmitter.on(
  UserActions.modUser,
  async ({ userId, modUserData, reqMethod, res }) => {
    try {
      if (!inClusterMode) {
        const modUser = await Users.modUser(userId, modUserData);
        sendResponseToUser(res, modUser, reqMethod, null);
      } else {
        sendUserMessageToMaster(
          UserActions.modUser,
          { userId, modUserData },
          reqMethod,
          res,
        );
      }
    } catch (error: any) {
      sendErrorToUser(error, res);
    }
  },
);

eventEmitter.on(UserActions.delUser, async ({ userId, reqMethod, res }) => {
  try {
    if (!inClusterMode) {
      await Users.delUser(userId);
      sendResponseToUser(res, null, reqMethod, null);
    } else {
      sendUserMessageToMaster(UserActions.delUser, userId, reqMethod, res);
    }
  } catch (error: any) {
    sendErrorToUser(error, res);
  }
});

eventEmitter.on(UserActions.delAllUsers, async ({ reqMethod, res }) => {
  try {
    if (!inClusterMode) {
      await Users.delAllUsers();
      sendResponseToUser(res, null, reqMethod, null);
    } else {
      sendUserMessageToMaster(UserActions.delAllUsers, null, reqMethod, res);
    }
  } catch (error: any) {
    sendErrorToUser(error, res);
  }
});

export default eventEmitter;

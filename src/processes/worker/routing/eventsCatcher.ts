import { EventEmitter } from 'node:events';
import { ServerResponse } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import { Users } from '@classes/users';
import UserActions from './userActions';
import processError from './processError';
import ActionsSentToMaster from '@classes/ActionsSentToMaster';

const inClusterMode = Boolean(process.env.MULTI);

console.log('In cluster mode:', inClusterMode);

const eventEmitter = new EventEmitter();

export type ErrorData = {
    code: number,
    message: string,
    typeName: string,
}

export type ActionData = {
    actionId: string,
    action: string,
    data: any;
    error: ErrorData | null;
}

function generateActionId(): string {
    return uuidv4();
}

export const actionsSentToMaster = new ActionsSentToMaster();

export function sendResponseToUser(res: ServerResponse, reqMethod: string, data: any) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');
    switch (reqMethod) {
        case 'GET':
        case 'PUT':
            res.statusCode = 200;
            break;
        case 'POST':
            res.statusCode = 201;
            break;
        case 'DEL':
            res.statusCode = 204;
            break;
        default:
            break;
    }
    res.write(JSON.stringify(data));
    res.end();
}

function sendUserMessageToMaster(
    action: string,
    data: object | null,
    reqMethod: string,
    res: ServerResponse
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
    })
    process.send(JSON.stringify(userAction));
}

eventEmitter.on(UserActions.addUser, async ({ newUserData, reqMethod, res }) => {
    try {
        if (!inClusterMode) {
            const newUser = await Users.addUser(newUserData);
            sendResponseToUser(res, reqMethod, newUser);
        } else {
            sendUserMessageToMaster(UserActions.addUser, newUserData, reqMethod, res);
        }
    } catch (error: any) {
        processError(error, res);
    }
});

eventEmitter.on(UserActions.getAllUsers, async ({ reqMethod, res }) => {
    try {
        if (!inClusterMode) {
            const allUsers = await Users.getAllUsers();
            sendResponseToUser(res, reqMethod, allUsers);
        } else {
            sendUserMessageToMaster(UserActions.getAllUsers, null, reqMethod, res);
        }
    } catch (error: any) {
        processError(error, res);
    }
});

eventEmitter.on(UserActions.getUser, async ({ userId, reqMethod, res }) => {
    try {
        if (!inClusterMode) {
            const user = await Users.getUserById(userId);
            sendResponseToUser(res, reqMethod, user);
        } else {
            sendUserMessageToMaster(UserActions.getUser, userId, reqMethod, res);
        }
    } catch (error: any) {
        processError(error, res);
    }
});

eventEmitter.on(UserActions.modUser, async ({ userId, modUserData, reqMethod, res }) => {
    try {
        if (!inClusterMode) {
            const modUser = await Users.modUser(userId, modUserData);
            sendResponseToUser(res, reqMethod, modUser);
        } else {
            sendUserMessageToMaster(UserActions.modUser, { userId, modUserData }, reqMethod, res);
        }
    } catch (error: any) {
        processError(error, res);
    }
});

eventEmitter.on(UserActions.delUser, async ({ userId, reqMethod, res }) => {
    try {
        if (!inClusterMode) {
            await Users.delUser(userId);
            sendResponseToUser(res, reqMethod, {});
        } else {
            sendUserMessageToMaster(UserActions.modUser, userId, reqMethod, res);
        }
    } catch (error: any) {
        processError(error, res);
    }
});

export default eventEmitter;

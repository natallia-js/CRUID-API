import http, { IncomingMessage, ServerResponse } from 'node:http';
import processGetRequest from './routing/processGetRequest';
import processPostRequest from './routing/processPostRequest';
import processPutRequest from './routing/processPutRequest';
import processDeleteRequest from './routing/processDeleteRequest';
import processUnknownRequest from './routing/processUnknownRequest';
import processError from './routing/processError';
import eventEmitter from './routing/eventsCatcher';
import { ActionData, sendResponseToUser, actionsSentToMaster } from './routing/eventsCatcher';
import { ActionSentToMaster } from '@classes/ActionsSentToMaster';
import {
    RoutingError,
    NonExistingEndpointRequestError,
    UserError,
    ROUTING_ERROR_CODES,
    USER_ERROR_CODES,
} from '@classes/errors';

const PORT = process.env.PORT;

process.on('uncaughtException', (error: any) => {
    console.log('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

function getErrorClassObject(className: string, errorCode: number, errorMessage: string) {
    switch (className) {
        case 'RoutingError':
            return new RoutingError(errorCode, errorMessage);
        case 'NonExistingEndpointRequestError':
            return new NonExistingEndpointRequestError();
        case 'UserError':
            return new UserError(errorCode, errorMessage);
        default:
            return new Error(errorMessage);
    }
}

process.on('message', (message: string) => {
    const messageFromMaster: ActionData = JSON.parse(message);
    const actionSentToMaster: ActionSentToMaster | undefined = actionsSentToMaster.getAction(messageFromMaster.actionId);
    if (!actionSentToMaster) return;
    if (messageFromMaster.error) {
        const errorObject = errorClassFactory()
        processError(messageFromMaster.error, actionSentToMaster.res);
        return;
    }
    sendResponseToUser(actionSentToMaster.res, actionSentToMaster.reqMethod, messageFromMaster.data);
    console.log('in Worker:', message)
});

const server = http.createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
        return res.end();
    }
    const baseUrl = '/api/users/';
    try {
        switch (req.method) {
            case 'GET':
                processGetRequest(req, res, baseUrl, eventEmitter);
                break;
            case 'POST':
                processPostRequest(req, res, baseUrl, eventEmitter);
                break;
            case 'PUT':
                processPutRequest(req, res, baseUrl, eventEmitter);
                break;
            case 'DELETE':
                processDeleteRequest(req, res, baseUrl, eventEmitter);
                break;
            default:
                processUnknownRequest(res, 'Request method is not supported');
                break;
        }
    } catch (error) {
        processError(error, res);
    }

    console.log('worker, pid = ' + process.pid + ', url = ' + req.url + ', statusCode = ' + res.statusCode)
});

server.listen(PORT, function() { console.log(`Worker with pid ${process.pid} is listening on port ${PORT}`) });

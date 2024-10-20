import { IncomingMessage, ServerResponse } from 'node:http';
import getReqURLNormalized, { getReqRenormalized } from './getReqURLNormalized';
import getParam from './getParam';
import { NonExistingEndpointRequestError } from '../../../classes/errors';
import { EventEmitter } from 'node:events';
import UserActions from './userActions';

async function processGetRequest(
    req: IncomingMessage,
    res: ServerResponse,
    baseUrl: string,
    eventEmitter: EventEmitter
) {
    let reqUrl = getReqURLNormalized(req);

    if (reqUrl?.startsWith(baseUrl)) {
        if (reqUrl === baseUrl) {
            eventEmitter.emit(UserActions.getAllUsers, { reqMethod: req.method, res });
        } else {
            const userId = getParam(baseUrl, getReqRenormalized(reqUrl));
            eventEmitter.emit(UserActions.getUser, {
                userId,
                reqMethod: req.method,
                res,
            });
        }
    } else {
        throw new NonExistingEndpointRequestError();
    }
}

export default processGetRequest;

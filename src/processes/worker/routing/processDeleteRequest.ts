import { IncomingMessage, ServerResponse } from 'node:http';
import getReqURLNormalized, { getReqRenormalized } from './getReqURLNormalized';
import getParam from './getParam';
import { NonExistingEndpointRequestError } from '../../../classes/errors';
import { EventEmitter } from 'node:events';
import UserActions from './userActions';

async function processDeleteRequest(
    req: IncomingMessage,
    res: ServerResponse,
    baseUrl: string,
    eventEmitter: EventEmitter
) {
    let reqUrl = getReqURLNormalized(req);

    if (reqUrl?.startsWith(baseUrl) && reqUrl !== baseUrl) {
        reqUrl = getReqRenormalized(reqUrl);
        const userId = getParam(baseUrl, reqUrl);
        eventEmitter.emit(UserActions.delUser, {
            userId,
            reqMethod: req.method,
            res,
        });
    } else {
        throw new NonExistingEndpointRequestError();
    }
}

export default processDeleteRequest;

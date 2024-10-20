import { IncomingMessage, ServerResponse } from 'node:http';
import getReqURLNormalized, { getReqRenormalized } from './getReqURLNormalized';
import getParam from './getParam';
import { NonExistingEndpointRequestError } from '../../../classes/errors';
import { EventEmitter } from 'node:events';
import UserActions from './userActions';

function processPutRequest(
    req: IncomingMessage,
    res: ServerResponse,
    baseUrl: string,
    eventEmitter: EventEmitter
) {
    let reqUrl = getReqURLNormalized(req);

    if (reqUrl?.startsWith(baseUrl) && reqUrl !== baseUrl) {
        reqUrl = getReqRenormalized(reqUrl);
        const userId = getParam(baseUrl, reqUrl);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const bodyData = JSON.parse(body);
            eventEmitter.emit(UserActions.modUser, {
                userId,
                modUserData: bodyData,
                reqMethod: req.method,
                res,
            });
        });
    } else {
        throw new NonExistingEndpointRequestError();
    }
}

export default processPutRequest;

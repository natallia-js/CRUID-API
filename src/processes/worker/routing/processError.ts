import { ServerResponse } from 'node:http';
import processWrongDataRequest from './processWrongDataRequest';
import processAppError from './processAppError';
import processUnknownRequest from './processUnknownRequest';
import { RoutingError, ROUTING_ERROR_CODES, UserError, USER_ERROR_CODES } from '@classes/errors';

const processError = (error: any, res: ServerResponse) => {
    if (error instanceof UserError) {
        switch (error.errorCode) {
            case USER_ERROR_CODES.userNotFound:
                processUnknownRequest(res, error.message);
                break;
            case USER_ERROR_CODES.wrongUserData:
                processWrongDataRequest(res, error.message);
                break;
            default:
                processAppError(res, error.message);
                break;
        }
    } else if (error instanceof RoutingError) {
        switch (error.errorCode) {
            case ROUTING_ERROR_CODES.requestToNonExistingEndpoint:
                processUnknownRequest(res, error.message);
                break;
            default:
                processAppError(res, error.message);
                break;
        }
    } else {
        processAppError(res, error.message);
    }
};

export default processError;

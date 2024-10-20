import { ServerResponse } from 'node:http';

function processAppError(res: ServerResponse, errorMessage: string) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');
    res.statusCode = 500;
    res.write(JSON.stringify({ message: errorMessage }));
    res.end();
}

export default processAppError;

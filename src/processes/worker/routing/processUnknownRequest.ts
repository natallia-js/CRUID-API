import { ServerResponse } from 'node:http';

function processUnknownRequest(res: ServerResponse, message: string) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');
    res.statusCode = 404;
    res.write(JSON.stringify({ message }));
    res.end();
}

export default processUnknownRequest;

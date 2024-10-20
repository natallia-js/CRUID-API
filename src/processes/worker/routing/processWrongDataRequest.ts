import { ServerResponse } from 'node:http';

function processWrongDataRequest(res: ServerResponse, errorMessage: string) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');
    res.statusCode = 400;
    res.write(JSON.stringify({ message: errorMessage }));
    res.end();
}

export default processWrongDataRequest;

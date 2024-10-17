import http, { IncomingMessage, ServerResponse } from 'node:http';
import url from 'url';
import { parse } from 'querystring';

const PORT = process.env.PORT;

const server = http.createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
        return res.end();
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');

    const reqMethod = req.method;

    res.statusCode = 200;

    switch (reqMethod) {
        case 'GET':
            processGetRequest(req, res);
            break;
        case 'POST':
            processPostRequest(req, res);
            break;
        case 'PUT':
            processPutRequest(req, res);
            break;
        case 'DELETE':
            processDeleteRequest(req, res);
            break;
        default:
            processDefaultRequest(req, res);
            break;
    }

    res.end();
    console.log('worker, pid = ' + process.pid + ', url = ' + req.url + ', statusCode = ' + res.statusCode)
});

function getReqURL(req: IncomingMessage) {
    return url.parse(req.url || '').pathname;
}

function processGetRequest(req: IncomingMessage, res: ServerResponse) {
    const reqUrl = getReqURL(req);
    switch(reqUrl) {
        case '/api/users':
            res.write(JSON.stringify({
                data: 'All users!',
            }));
            break;
    }
}

function processPostRequest(req: IncomingMessage, res: ServerResponse) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const feedbackData = parse(body);
        res.write(JSON.stringify({
            receivedData: feedbackData,
        }));
    });    
}

function processPutRequest(req: IncomingMessage, res: ServerResponse) {
    const userId = parseInt(req.url.split('/')[2]);
    console.log(req,res)
}

function processDeleteRequest(req: IncomingMessage, res: ServerResponse) {
    console.log(req,res)
}

function processDefaultRequest(req: IncomingMessage, res: ServerResponse) {
    console.log(req,res)
}

server.listen(PORT, function() { console.log(`Worker with pid ${process.pid} is listening on port ${PORT}`) });

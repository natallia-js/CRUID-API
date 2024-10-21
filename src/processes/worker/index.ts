import http, { IncomingMessage, ServerResponse } from "node:http";
import { RequestMethodNotSupportedError } from "@classes/errors/routingErrors";
import processGetRequest from "./routing/processGetRequest";
import processPostRequest from "./routing/processPostRequest";
import processPutRequest from "./routing/processPutRequest";
import processDeleteRequest from "./routing/processDeleteRequest";
import sendErrorToUser from "./routing/sendErrorToUser";
import eventEmitter from "./routing/eventsCatcher";

const inClusterMode = Boolean(process.env.MULTI);
const PORT = process.env.PORT;

import("@processes/worker/communication-with-master/processMessageFromMaster");

process.on("uncaughtException", (error: any) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error: any) => {
  console.error("Unhandled Rejection:", error);
});

const server = http.createServer();

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
  if (inClusterMode)
    console.log(
      "Request came to worker with pid = " + process.pid + ", url = " + req.url,
    );
  else console.log("Received request: url = ", req.url);

  req.on("error", () => {
    res.statusCode = 400;
    return res.end("Bad Request!");
  });

  res.on("error", () => {
    res.statusCode = 500;
    return res.end("Internal Server Error!");
  });

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  const baseUrl = "/api/users/";
  try {
    switch (req.method) {
      case "GET":
        processGetRequest(req, res, baseUrl, eventEmitter);
        break;
      case "POST":
        processPostRequest(req, res, baseUrl, eventEmitter);
        break;
      case "PUT":
        processPutRequest(req, res, baseUrl, eventEmitter);
        break;
      case "DELETE":
        processDeleteRequest(req, res, baseUrl, eventEmitter);
        break;
      default:
        throw new RequestMethodNotSupportedError();
    }
  } catch (error: any) {
    sendErrorToUser(error, res);
  }
});

server.listen(PORT, function () {
  console.log(`Worker with pid ${process.pid} is listening on port ${PORT}`);
});

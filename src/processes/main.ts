import { availableParallelism } from "node:os";
import cluster, { Worker } from "node:cluster";
import http, { IncomingMessage, ServerResponse } from "node:http";
import { WorkerEnv, Workers } from "@classes/workers";
import { Users } from "@classes/users";
import { ActionData } from "@processes/worker/communication-with-master/sendUserMessageToMaster";
import UserActions from "@processes/worker/routing/userActions";

Users.setShared();

const numCPUs = availableParallelism();
console.log(
  `Starting the application in cluster mode. Available parallelism is ${numCPUs}`,
);
console.log(`Primary with process pid = ${process.pid} is running`);

const PORT = process.env.PORT;
const workers: Workers = new Workers();

for (let i = 1; i < numCPUs; i++) {
  const _newWorkerEnv: WorkerEnv = {
    NAME: `worker_${i}`,
    PORT: Number(PORT) + i,
  };
  workers.addWorker(cluster.fork(_newWorkerEnv), _newWorkerEnv);
}

cluster.on("exit", (worker, code, signal) => {
  console.log(
    `Worker with pid ${worker.process.pid} closed, code = ${code}, signal = ${signal}`,
  );
  workers.recreateWorker(worker.process.pid, cluster.fork);
});

cluster.on("message", async (worker: Worker, message: string) => {
  const messageObject: ActionData = JSON.parse(message);
  const response: ActionData = {
    actionId: messageObject.actionId,
    action: messageObject.action,
    data: null,
    error: null,
  };
  try {
    switch (messageObject.action) {
      case UserActions.addUser:
        response.data = await Users.addUser(messageObject.data);
        break;
      case UserActions.getAllUsers:
        const data = await Users.getAllUsers();
        response.data = data;
        break;
      case UserActions.getUser:
        response.data = await Users.getUserById(messageObject.data);
        break;
      case UserActions.modUser:
        response.data = await Users.modUser(
          messageObject.data.userId,
          messageObject.data.modUserData,
        );
        break;
      case UserActions.delUser:
        await Users.delUser(messageObject.data);
        break;
      case UserActions.delAllUsers:
        await Users.delAllUsers();
        break;
      default:
        break;
    }
  } catch (error: any) {
    response.error = {
      code: error.errorCode,
      message: error.message,
      typeName: error.constructor.name,
    };
  }
  worker.send(JSON.stringify(response));
});

// a round-robin counter
let counter = 0;

process.on("uncaughtException", (error: any) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error: any) => {
  console.error("Unhandled Rejection:", error);
});

// creating a load balancer
const server = http.createServer();

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
  const worker = workers.getWorkerObjectByIndex(counter);
  counter = (counter + 1) % workers.getWorkersNumber();
  if (worker) {
    // Redirecting request to the selected worker...
    // In HTTP 1.1, there actually is a status code (307) which indicates that the request
    // should be repeated using the same method and post data.
    res.statusCode = 307;
    res.setHeader(
      "Location",
      `http://localhost:${worker.workerEnv.PORT}${req.url}`,
    );
  }
  return res.end();
});

server.listen(PORT, function () {
  console.log(`Load balancer is listening on port ${PORT}`);
});

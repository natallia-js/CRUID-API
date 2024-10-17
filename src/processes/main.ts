import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import http, { IncomingMessage, ServerResponse } from 'node:http';
import { WorkerEnv, Workers } from '@classes/workers';

const numCPUs = availableParallelism();
console.log(`Starting the application in cluster mode. Available parallelism is ${numCPUs}`);
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

cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker with pid ${worker.process.pid} closed, code = ${code}, signal = ${signal}`);
    workers.recreateWorker(worker.process.pid, cluster.fork);
});

// a round-robin counter
let counter = 0;

// creating a load balancer
const server = http.createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    const worker = workers.getWorkerObjectByIndex(counter);
    counter = (counter + 1) % workers.getWorkersNumber();
    if (worker) {
        // redirecting request to the selected worker
        res.statusCode = 301;
        res.setHeader('Location', `http://localhost:${worker.workerEnv.PORT}${req.url}`);
    }
    return res.end();
});

server.listen(PORT, function() { console.log(`Load balancer is listening on port ${PORT}`) });

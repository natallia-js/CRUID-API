import { Worker } from "node:cluster";

export type WorkerEnv = {
  NAME: string;
  PORT: number;
};

export type WorkerObject = {
  worker: Worker;
  workerEnv: WorkerEnv;
};

export class Workers {
  private workers: WorkerObject[];

  constructor() {
    this.workers = [];
  }

  public getWorkerObjectByIndex(index: number) {
    if (index < 0 || index > this.workers.length - 1) return null;
    return this.workers[index];
  }

  public getWorkersNumber() {
    return this.workers.length;
  }

  public addWorker(worker: Worker, workerEnv: WorkerEnv) {
    this.workers.push({
      worker,
      workerEnv,
    });
  }

  public recreateWorker(
    workerPid: number | undefined,
    createWorkerCallback: (env?: any) => Worker,
  ) {
    if (!workerPid) return;
    const workerIndex = this.workers.findIndex(
      (workerData) => workerData.worker.process.pid === workerPid,
    );
    if (workerIndex >= 0) {
      if (this.workers[workerIndex]) {
        const newWorker = createWorkerCallback(
          this.workers[workerIndex].workerEnv,
        );
        this.addWorker(newWorker, this.workers[workerIndex].workerEnv);
      }
      this.workers.splice(workerIndex, 1);
    }
  }
}

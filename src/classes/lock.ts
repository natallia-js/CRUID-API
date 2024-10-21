import { EventEmitter } from "node:events";

class Lock {
  private _locked: boolean;
  private _ee: any;

  constructor() {
    this._locked = false;
    this._ee = new EventEmitter();
  }

  public acquire() {
    return new Promise<void>((resolve) => {
      // If nobody has the lock, take it and resolve immediately
      if (!this._locked) {
        // Safe because JS doesn't interrupt you on synchronous operations,
        // so no need for compare-and-swap or anything like that.
        this._locked = true;
        return resolve();
      }
      // Otherwise, wait until somebody releases the lock and try again
      const tryAcquire = () => {
        if (!this._locked) {
          this._locked = true;
          this._ee.removeListener("release", tryAcquire);
          return resolve();
        }
      };
      this._ee.on("release", tryAcquire);
    });
  }

  public release() {
    // Release the lock immediately
    this._locked = false;
    setImmediate(() => this._ee.emit("release"));
  }
}

export default Lock;

import { Rule } from "@linter/domain";
import { Worker } from "worker_threads";
import { LintMessage } from "../models/LintMessage";
import { LintResponseMessage } from "../models/LintResponseMessage";
import path from 'path';

export class Agent {
  private worker: Worker;

  constructor(
    rules: string[],
    root: string,
  ) {
    this.worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: {
        rules,
        root,
      }
    });
  }

  public dispose() {
    return this.worker.terminate();
  }

  public process(filename: string): Promise<LintResponseMessage> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({ filename } satisfies LintMessage);

      const clearListeners = () => {
        this.worker.removeAllListeners('message');
        this.worker.removeAllListeners('error');

      };

      this.worker.on('error', (msg: any) => {
        console.error({ msg });
        clearListeners();
        reject(msg);
      });

      this.worker.on('message', (response: LintResponseMessage) => {
        clearListeners();
        resolve(response);
      });
    });
  }
}
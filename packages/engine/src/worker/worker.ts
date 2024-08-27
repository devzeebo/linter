import { workerData, parentPort } from "worker_threads";
import Engine from "../Engine";
import parserTypescript from '@linter/parser-typescript';
import fs from "fs";
import { Statement } from "@linter/domain";
import { flatten, replace } from "lodash/fp";
import { LintMessage } from "../models/LintMessage";
import { LintResponseMessage } from "../models/LintResponseMessage";

const { rules, root } = workerData;

const engine = new Engine();

const lintFile = async (filename: string) => {
  await engine.setRules(rules);

  const file = replace(root as string, '', filename)
  const text = fs.readFileSync(filename).toString();

  const ast = parserTypescript(text, file);

  const fileViolations = [];

  while (true) {
    const { value, done } = ast.next() as { value: Statement, done: boolean };
    if (done) {
      break;
    }

    const { type, text } = value;

    const violations = engine.runRulesForType(type, text);

    if (violations !== true) {
      fileViolations.push(violations);
    }
  }

  return flatten(fileViolations);
}

console.log('worker started');

parentPort!.on('message', async ({
  filename
}: LintMessage) => {
  const violations = await lintFile(filename);

  parentPort!.postMessage({ filename, violations } satisfies LintResponseMessage);
});
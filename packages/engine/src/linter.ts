import os from 'os';
import walk from "./walk";
import { AgentPool } from "./worker/AgentPool";
import { reporter } from '@linter/reporter-console';

const THREAD_COUNT = os.cpus().length;

const lint = async (
  rules: string[],
  root: string
) => {
  const agentPool = new AgentPool(THREAD_COUNT, rules, root);

  const files = walk({
    dir: root,
    excludes: [/node_modules/],
    filter: [/.ts$/]
  });

  for await (const file of files) {
    // console.log(file);
    const response = await agentPool.process(file);

    for (const violation of response.violations ?? []) {
      reporter(violation, response.filename);
    }
  }

  await agentPool.dispose();
};

export default lint;
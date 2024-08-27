import { Agent } from "./Agent";
import { LintResponseMessage } from "../models/LintResponseMessage";
import { createPool, Pool } from "generic-pool";

export class AgentPool {
  private pool: Pool<Agent>;

  constructor(numAgents: number, rules: string[], root: string) {
    this.pool = createPool(
      {
        create: () => Promise.resolve(new Agent(rules, root)),
        destroy: (agent: Agent) => agent.dispose() as unknown as Promise<void>,
      },
      {
        max: numAgents
      }
    );
  }

  public dispose() {
    return this.pool.drain();
  }

  public async process(filename: string): Promise<LintResponseMessage> {
    const agent = await this.pool.acquire();
    // console.log('agent acquired', filename);

    return await agent.process(filename)
      .catch((e) => {
        console.error(e);
        return Promise.reject(e);
      })
      .finally(() => {
        this.pool.release(agent);
      })
  }
}
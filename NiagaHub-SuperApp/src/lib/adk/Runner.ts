import { AdkAgent } from './Agent';

export class AdkRunner {
  private agents: Map<string, AdkAgent> = new Map();
  private state: Record<string, any> = {};

  registerAgent(agent: AdkAgent, id: string) {
    this.agents.set(id, agent);
  }

  async executeWorkflow(workflow: string[], initialInput: string) {
    let currentInput = initialInput;
    const logs = [];

    for (const agentId of workflow) {
      const agent = this.agents.get(agentId);
      if (!agent) continue;

      const output = await agent.run(currentInput, this.state);
      
      this.state[agentId] = output;
      logs.push({ agent: agentId, output });
      currentInput = output;
    }

    return { logs, finalResult: currentInput };
  }
}

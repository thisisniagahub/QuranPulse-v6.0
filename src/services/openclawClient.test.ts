import { describe, it, expect } from '@jest/globals';

describe('openclawClient', () => {
  it('should export openclawClient object', async () => {
    const { openclawClient } = await import('./openclawClient');
    expect(openclawClient).toBeDefined();
    expect(openclawClient.chatCompletion).toBeInstanceOf(Function);
    expect(openclawClient.askUstaz).toBeInstanceOf(Function);
    expect(openclawClient.hookRequest).toBeInstanceOf(Function);
    expect(openclawClient.healthCheck).toBeInstanceOf(Function);
  });
});

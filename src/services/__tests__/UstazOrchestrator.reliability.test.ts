import { UstazOrchestrator } from '../UstazOrchestrator';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

describe('UstazOrchestrator Reliability Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('BUG: hukum solat should go to compliance, not worship', async () => {
    // Current behavior: matches solat in isWorshipIntent first
    const query = 'hukum solat dalam kapal terbang';
    
    // Mock for both just in case
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { status: 'found', data: { ruling: 'Boleh' }, source: 'jakim_fatwa' },
      error: null
    });

    await UstazOrchestrator.detectAndCall(query);
    
    // If it fails, it will have called mcp-worship instead of mcp-compliance
    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-compliance', expect.anything());
  });
});

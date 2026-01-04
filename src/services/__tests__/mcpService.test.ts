import { MCPService } from '../mcpService';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

describe('MCPService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect worship intent', () => {
    expect(MCPService.isWorshipIntent('pukul berapa subuh hari ni')).toBe(true);
    expect(MCPService.isWorshipIntent('waktu asar gombak')).toBe(true);
    expect(MCPService.isWorshipIntent('hukum forex')).toBe(false);
  });

  test('should detect compliance intent', () => {
    expect(MCPService.isComplianceIntent('hukum makan babi')).toBe(true);
    expect(MCPService.isComplianceIntent('status halal mcd')).toBe(true);
    expect(MCPService.isComplianceIntent('waktu zohor')).toBe(false);
  });

  test('should detect quran intent', () => {
    expect(MCPService.isQuranIntent('ayat tentang sabar')).toBe(true);
    expect(MCPService.isQuranIntent('surah al-waqiah')).toBe(true);
    expect(MCPService.isQuranIntent('status halal')).toBe(false);
  });

  test('should detect zakat intent', () => {
    expect(MCPService.isZakatIntent('kira zakat emas')).toBe(true);
    expect(MCPService.isZakatIntent('bayar fitrah')).toBe(true);
    expect(MCPService.isZakatIntent('cari ayat')).toBe(false);
  });

  test('should call mcp-worship for worship intent', async () => {
    // Mock successful response
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        source: 'jakim',
        zone: 'WLP01',
        date: '2026-01-01',
        times: { subuh: '06:00', zohor: '13:30', asar: '16:00', maghrib: '19:00', isyak: '20:30', imsak: '05:50', syuruk: '07:15' }
      },
      error: null
    });

    const result = await MCPService.detectAndCall('waktu zohor WLP01');
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-worship', {
      body: { zone: 'WLP01' }
    });
    expect(result?.summary).toContain('Waktu Solat');
  });

  test('should call mcp-quran for quran intent', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        results: [{ ref: 'Al-Baqarah 2:153', text: 'Wahai orang yang beriman, jadikanlah sabar...' }]
      },
      error: null
    });

    const result = await MCPService.detectAndCall('ayat tentang sabar');

    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-quran', {
      body: { intent: 'search', query: 'sabar', lang: 'ms' }
    });
    expect(result?.summary).toContain('Al-Baqarah 2:153');
  });

  test('should call mcp-zakat for zakat intent', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        result: { status: 'eligible', zakat_payable_myr: 125, breakdown: { nisab_2025: 24000 } }
      },
      error: null
    });

    const result = await MCPService.detectAndCall('kira zakat gaji 5000');

    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-zakat', {
      body: { type: 'income', amount: 5000, state: 'WLP' }
    });
    expect(result?.summary).toContain('RM125');
  });
});

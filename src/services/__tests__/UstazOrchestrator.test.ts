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

describe('UstazOrchestrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect worship intent', () => {
    expect(UstazOrchestrator.isWorshipIntent('pukul berapa subuh hari ni')).toBe(true);
    expect(UstazOrchestrator.isWorshipIntent('waktu asar gombak')).toBe(true);
    expect(UstazOrchestrator.isWorshipIntent('hukum forex')).toBe(false);
  });

  test('should detect compliance intent', () => {
    expect(UstazOrchestrator.isComplianceIntent('hukum makan babi')).toBe(true);
    expect(UstazOrchestrator.isComplianceIntent('status halal mcd')).toBe(true);
    expect(UstazOrchestrator.isComplianceIntent('waktu zohor')).toBe(false);
  });

  test('should detect quran intent', () => {
    expect(UstazOrchestrator.isQuranIntent('ayat tentang sabar')).toBe(true);
    expect(UstazOrchestrator.isQuranIntent('surah al-waqiah')).toBe(true);
    expect(UstazOrchestrator.isQuranIntent('status halal')).toBe(false);
  });

  test('should detect zakat intent', () => {
    expect(UstazOrchestrator.isZakatIntent('kira zakat emas')).toBe(true);
    expect(UstazOrchestrator.isZakatIntent('bayar fitrah')).toBe(true);
    expect(UstazOrchestrator.isZakatIntent('cari ayat')).toBe(false);
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

    const result = await UstazOrchestrator.detectAndCall('waktu zohor WLP01');

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

    const result = await UstazOrchestrator.detectAndCall('ayat tentang sabar');

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

    const result = await UstazOrchestrator.detectAndCall('kira zakat gaji 5000');

    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-zakat', {
      body: { type: 'income', amount: 5000, state: 'WLP' }
    });
    expect(result?.summary).toContain('RM125');
  });

  test('should detect admin intent', () => {
    expect(UstazOrchestrator.isAdminIntent('show user stats')).toBe(true);
    expect(UstazOrchestrator.isAdminIntent('system health check')).toBe(true);
    expect(UstazOrchestrator.isAdminIntent('berapa pengguna')).toBe(true);
    expect(UstazOrchestrator.isAdminIntent('waktu zohor')).toBe(false);
  });

  test('should call mcp-admin for admin intent', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        intent: 'user_stats',
        data: {
          total_users: 1234,
          new_users: 56,
          timeframe: 'today',
          summary: '📊 Total: 1234 users | New (today): 56'
        }
      },
      error: null
    });

    const result = await UstazOrchestrator.detectAndCall('show user stats');

    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-admin', {
      body: { intent: 'user_stats', query: 'show user stats', timeframe: 'today' }
    });
    expect(result?.summary).toContain('Admin');
  });

  test('should detect admin content stats intent', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        intent: 'content_stats',
        data: {
          quran_verses: 6236,
          hadiths: 7275,
          summary: '📖 Quran Verses: 6236 | Hadiths: 7275'
        }
      },
      error: null
    });

    const result = await UstazOrchestrator.detectAndCall('content stats analytics');

    expect(supabase.functions.invoke).toHaveBeenCalledWith('mcp-admin', {
      body: { intent: 'content_stats', query: 'content stats analytics', timeframe: 'today' }
    });
    expect(result?.summary).toContain('Admin');
  });
});
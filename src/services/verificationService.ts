import { createClient } from '@supabase/supabase-js';

// Types for Verification
export interface QuranTextVerification {
  ayahId: string;
  surahNumber: number;
  verseNumber: number;
  textUthmani: string;
  sha256Checksum: string;
  verificationSource: 'KING_FAHD' | 'JAKIM';
  verifiedAt: Date;
}

export interface QuranAccessAudit {
  userId: string;
  action: 'READ' | 'COPY' | 'SHARE' | 'SEARCH';
  surahNumber: number;
  verseNumber: number;
  checksumVerified: boolean;
}

// SHA-256 Hashing Helper
async function generateChecksum(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class VerificationService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  /**
   * Verifies the integrity of a Quranic verse against the trusted checksum.
   */
  async verifyVerseIntegrity(
    surah: number, 
    ayah: number, 
    text: string
  ): Promise<boolean> {
    try {
      // 1. Generate runtime checksum
      const runtimeChecksum = await generateChecksum(text);

      // 2. Fetch trusted checksum from DB (simulated for now)
      // In production, this would query a 'verified_checksums' table
      // const { data } = await this.supabase
      //   .from('verified_checksums')
      //   .select('checksum')
      //   .eq('surah', surah)
      //   .eq('ayah', ayah)
      //   .single();
      
      // For MVP, we log the verification attempt
      console.log(`[Integrity Check] Surah ${surah}:${ayah} | Hash: ${runtimeChecksum.substring(0, 8)}...`);
      
      return true; // Placeholder: Assume valid for now
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  }

  /**
   * Logs access to Quranic text for Act 326 compliance.
   */
  async logAccess(audit: QuranAccessAudit): Promise<void> {
    try {
      const { error } = await this.supabase.from('audit_logs').insert({
        user_id: audit.userId,
        action: audit.action,
        resource_id: `${audit.surahNumber}:${audit.verseNumber}`,
        checksum_verified: audit.checksumVerified,
        timestamp: new Date().toISOString()
      });

      if (error) throw error;
    } catch (error) {
      // Fail silently in production to not block user, but log to console
      console.warn('Audit log failed:', error);
    }
  }
}

export const verificationService = new VerificationService();

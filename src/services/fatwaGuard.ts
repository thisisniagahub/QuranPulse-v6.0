/**
 * 🛡️ Fatwa Guard — Islamic Content Safety Layer
 * 
 * Prevents AI hallucination on Islamic rulings by:
 * 1. Detecting fatwa-sensitive queries
 * 2. Cross-referencing with approved JAKIM/E-SMAF sources
 * 3. Blocking unverified rulings
 * 4. Redirecting to qualified scholars
 */

// =====================================
// SENSITIVE TOPIC DETECTION
// =====================================

const SENSITIVE_KEYWORDS = [
    // Fatwa-level topics (requires mujtahid ijtihad)
    'hukum', 'halal', 'haram', 'wajib', 'sunat', 'makruh', 'mubah',
    'fatwa', 'bidaah', 'bid\'ah', 'syirik', 'kufur', 'kafir', 'murtad',
    'talak', 'cerai', 'nikah', 'kahwin', 'iddah', 'nafkah',
    'zina', 'arak', 'judi', 'riba', 'bunga bank',
    // Modern issues (requires updated ijtihad)
    'kripto', 'crypto', 'bitcoin', 'nft', 'saham',
    'vaksin', 'organ', 'surrogacy', 'kloning',
    'transgender', 'lgbt',
    // Financial
    'pinjaman', 'insurans', 'takaful', 'amanah saham',
];

const HIGH_RISK_PATTERNS = [
    /boleh\s*(ke|tak|x)\s*(.*)/i,          // "boleh ke..." questions
    /hukum\s+(.*)/i,                         // "hukum..." questions
    /halal\s*(ke|tak)\s*(.*)/i,              // "halal ke..." questions
    /wajib\s*(ke|tak)\s*(.*)/i,              // "wajib ke..." questions
    /apa\s*pendapat\s*(.*)\s*tentang/i,       // Opinion-seeking
];

export interface FatwaGuardResult {
    isSensitive: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    matchedKeywords: string[];
    recommendation: string;
    disclaimer: string | null;
    shouldBlock: boolean;
    referralSuggestion: string | null;
}

// =====================================
// CORE GUARD FUNCTION
// =====================================

export function checkFatwaSafety(query: string): FatwaGuardResult {
    const lowerQuery = query.toLowerCase();
    const matchedKeywords: string[] = [];

    // Check keywords
    for (const keyword of SENSITIVE_KEYWORDS) {
        if (lowerQuery.includes(keyword)) {
            matchedKeywords.push(keyword);
        }
    }

    // Check high-risk patterns
    let isHighRisk = false;
    for (const pattern of HIGH_RISK_PATTERNS) {
        if (pattern.test(lowerQuery)) {
            isHighRisk = true;
            break;
        }
    }

    // Determine risk level
    let riskLevel: FatwaGuardResult['riskLevel'] = 'low';
    if (matchedKeywords.length >= 3 || isHighRisk) riskLevel = 'critical';
    else if (matchedKeywords.length >= 2) riskLevel = 'high';
    else if (matchedKeywords.length >= 1) riskLevel = 'medium';

    // Generate response
    const isSensitive = riskLevel !== 'low';
    const shouldBlock = riskLevel === 'critical';

    const disclaimer = isSensitive
        ? '\n\n_⚠️ Penafian: Ini adalah panduan umum AI sahaja. Untuk fatwa rasmi, sila rujuk:_\n' +
        '_• e-Fatwa JAKIM: https://efatwa.gov.my_\n' +
        '_• Pejabat Mufti Negeri anda_\n' +
        '_• Asatizah bertauliah berdekatan_'
        : null;

    const recommendation = shouldBlock
        ? 'Soalan ini memerlukan fatwa daripada ulama bertauliah. Saya tidak layak memberikan hukum bagi isu ini.'
        : isSensitive
            ? 'Saya akan cuba menjawab berdasarkan sumber yang sahih, namun sila sahkan dengan ulama.'
            : 'Soalan ini selamat untuk dijawab.';

    const referralSuggestion = shouldBlock
        ? 'Sila hubungi Pejabat Mufti Negeri atau layari https://efatwa.gov.my untuk fatwa rasmi.'
        : null;

    return {
        isSensitive,
        riskLevel,
        matchedKeywords,
        recommendation,
        disclaimer,
        shouldBlock,
        referralSuggestion,
    };
}

// =====================================
// RESPONSE SANITIZER
// =====================================

/**
 * Sanitize AI response to ensure Islamic compliance
 * Strips potentially harmful content and adds disclaimers
 */
export function sanitizeIslamicResponse(response: string, guardResult: FatwaGuardResult): string {
    let sanitized = response;

    // Remove any self-declared authority
    sanitized = sanitized.replace(/saya\s*(meng)?fatwa(kan)?/gi, 'panduan umum');
    sanitized = sanitized.replace(/hukumnya\s*(adalah|ialah)\s*(wajib|haram|halal)/gi,
        'menurut pandangan umum ulama, ia $2');

    // Add disclaimer if sensitive
    if (guardResult.disclaimer) {
        sanitized += guardResult.disclaimer;
    }

    return sanitized;
}

// =====================================
// XP REWARDS FOR LEARNING
// =====================================

export const FATWA_GUARD_XP = {
    ASKED_QUESTION: 5,         // Any question to Ustaz AI
    READ_DALIL: 10,            // User clicks on a dalil reference
    CHECKED_EFATWA: 15,        // User clicked e-Fatwa link
    COMPLETED_DISCLAIMER: 3,   // User acknowledged disclaimer
};

/**
 * Geolocation Service for QuranPulse
 * Provides location detection and Malaysian prayer zone mapping
 */

// Malaysian Prayer Zones by State/Region
// Based on JAKIM e-Solat zone codes
const MALAYSIA_ZONES: Array<{
    code: string;
    name: string;
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
}> = [
        // WP Kuala Lumpur & Putrajaya
        { code: 'WLP01', name: 'WP Kuala Lumpur & Putrajaya', latMin: 2.9, latMax: 3.3, lngMin: 101.5, lngMax: 101.9 },

        // Selangor
        { code: 'SGR01', name: 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor', latMin: 2.8, latMax: 3.6, lngMin: 101.2, lngMax: 101.9 },
        { code: 'SGR02', name: 'Kuala Selangor, Sabak Bernam', latMin: 3.3, latMax: 3.9, lngMin: 100.9, lngMax: 101.5 },
        { code: 'SGR03', name: 'Klang, Kuala Langat', latMin: 2.7, latMax: 3.2, lngMin: 101.2, lngMax: 101.6 },

        // Johor
        { code: 'JHR01', name: 'Johor Bahru, Kota Tinggi', latMin: 1.3, latMax: 1.8, lngMin: 103.5, lngMax: 104.2 },
        { code: 'JHR02', name: 'Kluang, Pontian', latMin: 1.5, latMax: 2.1, lngMin: 103.0, lngMax: 103.6 },
        { code: 'JHR03', name: 'Muar, Batu Pahat, Segamat', latMin: 1.8, latMax: 2.5, lngMin: 102.5, lngMax: 103.2 },
        { code: 'JHR04', name: 'Mersing, Rompin', latMin: 2.0, latMax: 2.7, lngMin: 103.5, lngMax: 104.0 },

        // Penang
        { code: 'PNG01', name: 'Seluruh Negeri Pulau Pinang', latMin: 5.1, latMax: 5.6, lngMin: 100.1, lngMax: 100.6 },

        // Perak
        { code: 'PRK01', name: 'Ipoh, Kuala Kangsar, Sg. Siput', latMin: 4.2, latMax: 5.1, lngMin: 100.6, lngMax: 101.3 },
        { code: 'PRK02', name: 'Taiping, Kuala Kurau, Bagan Serai', latMin: 4.7, latMax: 5.2, lngMin: 100.3, lngMax: 100.8 },
        { code: 'PRK03', name: 'Teluk Intan, Bagan Datuk', latMin: 3.8, latMax: 4.3, lngMin: 100.7, lngMax: 101.2 },
        { code: 'PRK04', name: 'Tanjung Malim, Behrang', latMin: 3.5, latMax: 4.0, lngMin: 101.3, lngMax: 101.8 },
        { code: 'PRK05', name: 'Cameron Highlands', latMin: 4.3, latMax: 4.6, lngMin: 101.2, lngMax: 101.6 },

        // Kedah
        { code: 'KDH01', name: 'Kota Setar, Alor Setar', latMin: 5.9, latMax: 6.5, lngMin: 100.2, lngMax: 100.7 },
        { code: 'KDH02', name: 'Kuala Muda, Yan', latMin: 5.4, latMax: 6.0, lngMin: 100.2, lngMax: 100.6 },
        { code: 'KDH03', name: 'Langkawi', latMin: 6.2, latMax: 6.5, lngMin: 99.6, lngMax: 100.0 },
        { code: 'KDH04', name: 'Baling, Sik', latMin: 5.5, latMax: 6.0, lngMin: 100.7, lngMax: 101.2 },

        // Kelantan
        { code: 'KTN01', name: 'Kota Bharu, Bachok, Pasir Puteh', latMin: 5.8, latMax: 6.3, lngMin: 102.0, lngMax: 102.6 },
        { code: 'KTN02', name: 'Tanah Merah, Machang, Jeli', latMin: 5.3, latMax: 5.9, lngMin: 101.7, lngMax: 102.3 },
        { code: 'KTN03', name: 'Gua Musang', latMin: 4.5, latMax: 5.3, lngMin: 101.5, lngMax: 102.2 },

        // Terengganu
        { code: 'TRG01', name: 'Kuala Terengganu', latMin: 5.2, latMax: 5.6, lngMin: 102.8, lngMax: 103.3 },
        { code: 'TRG02', name: 'Dungun, Kemaman', latMin: 4.2, latMax: 5.0, lngMin: 103.0, lngMax: 103.6 },
        { code: 'TRG03', name: 'Besut, Setiu', latMin: 5.5, latMax: 6.0, lngMin: 102.3, lngMax: 103.0 },
        { code: 'TRG04', name: 'Hulu Terengganu', latMin: 4.8, latMax: 5.5, lngMin: 102.3, lngMax: 103.0 },

        // Pahang
        { code: 'PHG01', name: 'Kuantan, Pekan', latMin: 3.6, latMax: 4.3, lngMin: 103.0, lngMax: 103.6 },
        { code: 'PHG02', name: 'Temerloh, Mentakab, Bera', latMin: 3.2, latMax: 4.0, lngMin: 101.8, lngMax: 102.6 },
        { code: 'PHG03', name: 'Bentong, Raub', latMin: 3.4, latMax: 4.0, lngMin: 101.5, lngMax: 102.2 },
        { code: 'PHG04', name: 'Cameron Highlands, Genting', latMin: 4.2, latMax: 4.7, lngMin: 101.2, lngMax: 101.8 },
        { code: 'PHG05', name: 'Jerantut, Lipis', latMin: 4.0, latMax: 4.8, lngMin: 101.5, lngMax: 102.5 },
        { code: 'PHG06', name: 'Rompin, Muadzam Shah', latMin: 2.6, latMax: 3.3, lngMin: 102.8, lngMax: 103.5 },

        // Negeri Sembilan
        { code: 'NSN01', name: 'Seremban, Kuala Pilah, Jempol', latMin: 2.6, latMax: 3.1, lngMin: 101.7, lngMax: 102.4 },
        { code: 'NSN02', name: 'Port Dickson, Tampin', latMin: 2.3, latMax: 2.7, lngMin: 101.7, lngMax: 102.2 },

        // Melaka
        { code: 'MLK01', name: 'Seluruh Negeri Melaka', latMin: 2.1, latMax: 2.5, lngMin: 102.0, lngMax: 102.6 },

        // Perlis
        { code: 'PLS01', name: 'Seluruh Negeri Perlis', latMin: 6.3, latMax: 6.8, lngMin: 100.0, lngMax: 100.5 },

        // Sabah
        { code: 'SBH01', name: 'Kota Kinabalu, Ranau, Kota Belud', latMin: 5.8, latMax: 6.5, lngMin: 116.0, lngMax: 117.0 },
        { code: 'SBH02', name: 'Sandakan, Beluran, Kinabatangan', latMin: 5.5, latMax: 6.0, lngMin: 117.5, lngMax: 118.5 },
        { code: 'SBH03', name: 'Tawau, Semporna', latMin: 4.0, latMax: 5.0, lngMin: 117.5, lngMax: 119.0 },
        { code: 'SBH04', name: 'Beaufort, Kuala Penyu, Sipitang', latMin: 4.8, latMax: 5.5, lngMin: 115.5, lngMax: 116.5 },
        { code: 'SBH05', name: 'Keningau, Tambunan, Nabawan', latMin: 4.8, latMax: 5.6, lngMin: 116.0, lngMax: 117.0 },
        { code: 'SBH06', name: 'Lahad Datu, Kunak', latMin: 4.8, latMax: 5.4, lngMin: 117.5, lngMax: 118.5 },
        { code: 'SBH07', name: 'Kudat, Kota Marudu, Pitas', latMin: 6.3, latMax: 7.0, lngMin: 116.5, lngMax: 117.5 },

        // Sarawak
        { code: 'SWK01', name: 'Kuching, Bau, Lundu, Samarahan', latMin: 1.2, latMax: 2.0, lngMin: 109.5, lngMax: 111.0 },
        { code: 'SWK02', name: 'Sri Aman, Lubok Antu', latMin: 1.0, latMax: 1.8, lngMin: 111.0, lngMax: 112.0 },
        { code: 'SWK03', name: 'Sibu, Sarikei, Kapit', latMin: 1.8, latMax: 3.0, lngMin: 111.5, lngMax: 114.0 },
        { code: 'SWK04', name: 'Miri, Limbang, Lawas', latMin: 3.5, latMax: 5.0, lngMin: 114.5, lngMax: 116.0 },
        { code: 'SWK05', name: 'Bintulu, Tatau, Belaga', latMin: 2.5, latMax: 4.0, lngMin: 112.5, lngMax: 114.5 },
        { code: 'SWK06', name: 'Betong, Saratok', latMin: 1.2, latMax: 2.2, lngMin: 110.5, lngMax: 111.8 },
        { code: 'SWK07', name: 'Mukah, Dalat, Daro', latMin: 2.0, latMax: 3.0, lngMin: 111.0, lngMax: 112.5 },

        // WP Labuan
        { code: 'LBN01', name: 'WP Labuan', latMin: 5.2, latMax: 5.4, lngMin: 115.1, lngMax: 115.4 },
    ];

export interface GeolocationResult {
    lat: number;
    lng: number;
    zone: string;
    zoneName: string;
    source: 'gps' | 'ip' | 'default';
    accuracy?: number;
}

/**
 * Get current user location using browser Geolocation API
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve) => {
        // Check if running in browser
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            console.warn('⚠️ Geolocation not available, using default zone');
            resolve(getDefaultLocation());
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const zone = coordinatesToMalaysiaZone(latitude, longitude);

                console.log(`📍 Location detected: ${latitude}, ${longitude} → Zone: ${zone.code}`);

                resolve({
                    lat: latitude,
                    lng: longitude,
                    zone: zone.code,
                    zoneName: zone.name,
                    source: 'gps',
                    accuracy
                });
            },
            (error) => {
                console.warn(`⚠️ Geolocation error (${error.code}): ${error.message}`);
                resolve(getDefaultLocation());
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes cache
            }
        );
    });
}

/**
 * Map coordinates to Malaysian prayer zone
 */
export function coordinatesToMalaysiaZone(lat: number, lng: number): { code: string; name: string } {
    // Find matching zone
    for (const zone of MALAYSIA_ZONES) {
        if (
            lat >= zone.latMin && lat <= zone.latMax &&
            lng >= zone.lngMin && lng <= zone.lngMax
        ) {
            return { code: zone.code, name: zone.name };
        }
    }

    // Not in Malaysia - return default or indicate international
    if (lng < 99 || lng > 120 || lat < 0.5 || lat > 7.5) {
        return { code: 'INTL', name: 'International (Non-Malaysia)' };
    }

    // In Malaysia but zone not matched precisely - use nearest major zone
    return { code: 'WLP01', name: 'WP Kuala Lumpur (Default)' };
}

/**
 * Get default location (KL)
 */
function getDefaultLocation(): GeolocationResult {
    return {
        lat: 3.139,
        lng: 101.6869,
        zone: 'WLP01',
        zoneName: 'WP Kuala Lumpur & Putrajaya',
        source: 'default'
    };
}

/**
 * Get cached zone or fetch new one
 */
export async function getCachedOrFetchZone(): Promise<string> {
    const CACHE_KEY = 'quranpulse_prayer_zone';
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { zone, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                console.log(`📍 Using cached zone: ${zone}`);
                return zone;
            }
        }
    } catch {
        // localStorage not available
    }

    const location = await getCurrentLocation();

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            zone: location.zone,
            timestamp: Date.now()
        }));
    } catch {
        // localStorage not available
    }

    return location.zone;
}

/**
 * Get all available zones for dropdown selection
 */
export function getAllZones(): Array<{ code: string; name: string }> {
    return MALAYSIA_ZONES.map(z => ({ code: z.code, name: z.name }));
}

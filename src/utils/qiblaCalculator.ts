// src/utils/qiblaCalculator.ts
// Standard Qibla calculation based on user's location

// Coordinates for Kaaba in Mecca
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

/**
 * Calculates the Qibla direction (angle from North, clockwise)
 * based on the user's current latitude and longitude.
 *
 * Formula derived from spherical trigonometry, also known as the Haversine formula
 * or great-circle distance/bearing.
 *
 * @param latitude User's current latitude
 * @param longitude User's current longitude
 * @returns Qibla angle in degrees (0-360) from True North, or null if input is invalid.
 */
export function calculateQiblaDirection(latitude: number, longitude: number): number | null {
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
    console.error('Invalid latitude or longitude provided for Qibla calculation.');
    return null;
  }

  // Convert degrees to radians
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LATITUDE * Math.PI) / 180;
  const kaabaLonRad = (KAABA_LONGITUDE * Math.PI) / 180;

  const deltaLon = kaabaLonRad - lonRad;

  const y = Math.sin(deltaLon);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(deltaLon);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  // Normalize to 0-360 degrees
  if (qiblaDeg < 0) {
    qiblaDeg += 360;
  }

  return qiblaDeg;
}

import { useState, useEffect, useCallback } from 'react';
import { calculateQiblaDirection } from '../utils/qiblaCalculator'; // We'll create this utility

export interface QiblaData {
  /** The angle to Qibla relative to North (0-360 degrees) */
  qiblaAngle: number | null;
  /** The current device heading (0-360 degrees) */
  deviceHeading: number | null;
  /** The absolute difference between device heading and Qibla angle */
  headingDifference: number | null;
  /** True if the device is pointing towards Qibla within a tolerance */
  isPointingQibla: boolean;
  /** The current latitude */
  latitude: number | null;
  /** The current longitude */
  longitude: number | null;
  /** Loading state for geolocation */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** True if device orientation sensor is available */
  isDeviceOrientationSupported: boolean;
  /** True if geolocation is supported */
  isGeolocationSupported: boolean;
}

const QIBLA_TOLERANCE_DEGREES = 5; // How close to Qibla is considered "pointing"

export const useQibla = () => {
  const [qiblaData, setQiblaData] = useState<QiblaData>({
    qiblaAngle: null,
    deviceHeading: null,
    headingDifference: null,
    isPointingQibla: false,
    latitude: null,
    longitude: null,
    isLoading: true,
    error: null,
    isDeviceOrientationSupported: false,
    isGeolocationSupported: false,
  });

  const [geoGranted, setGeoGranted] = useState(false);

  // 1. Get User Location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setQiblaData(prev => ({ ...prev, error: 'Geolocation not supported by your browser.', isLoading: false, isGeolocationSupported: false }));
      return;
    }

    setQiblaData(prev => ({ ...prev, isGeolocationSupported: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQiblaData(prev => ({ ...prev, latitude, longitude, isLoading: false }));
        setGeoGranted(true);
      },
      (geoError) => {
        let errorMessage = 'Failed to get location. ';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage += 'Please grant location access.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case geoError.TIMEOUT:
            errorMessage += 'The request to get user location timed out.';
            break;
          default:
            errorMessage += geoError.message;
        }
        setQiblaData(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // 2. Get Device Heading
  useEffect(() => {
    // Check if device orientation event is supported
    if (window.DeviceOrientationEvent) {
      setQiblaData(prev => ({ ...prev, isDeviceOrientationSupported: true }));

      const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (event.webkitCompassHeading !== undefined) { // iOS specific
          const heading = event.webkitCompassHeading;
          setQiblaData(prev => ({ ...prev, deviceHeading: heading }));
        } else if (event.alpha !== null) { // Standard browsers
          const alpha = event.alpha; // 0-360 degrees (relative to true north if absolute)
          // On Android, alpha is relative to phone's top. Need to adjust for screen rotation.
          // This is a complex topic, often requiring `screen.orientation.angle`
          // For simplicity, let's assume alpha is relative to true north for now.
          const heading = (360 - alpha) % 360; // Convert to clockwise from North
          setQiblaData(prev => ({ ...prev, deviceHeading: heading }));
        }
      };

      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      };
    } else {
      setQiblaData(prev => ({ ...prev, error: 'Device orientation sensor not supported.', isDeviceOrientationSupported: false }));
    }
  }, []);

  // 3. Calculate Qibla Angle and Difference
  useEffect(() => {
    if (qiblaData.latitude !== null && qiblaData.longitude !== null) {
      const qiblaAngle = calculateQiblaDirection(qiblaData.latitude, qiblaData.longitude);
      setQiblaData(prev => ({ ...prev, qiblaAngle }));
    }
  }, [qiblaData.latitude, qiblaData.longitude]);

  useEffect(() => {
    if (qiblaData.qiblaAngle !== null && qiblaData.deviceHeading !== null) {
      let diff = qiblaData.deviceHeading - qiblaData.qiblaAngle;
      diff = (diff + 360) % 360; // Normalize to 0-360
      if (diff > 180) diff -= 360; // Ensure shortest angle
      if (diff < -180) diff += 360;

      const isPointing = Math.abs(diff) <= QIBLA_TOLERANCE_DEGREES;
      setQiblaData(prev => ({ ...prev, headingDifference: diff, isPointingQibla: isPointing }));
    }
  }, [qiblaData.qiblaAngle, qiblaData.deviceHeading]);

  // Request geolocation permission on component mount or button click
  useEffect(() => {
    if (!geoGranted && qiblaData.isGeolocationSupported && qiblaData.isLoading) {
        getUserLocation();
    }
  }, [geoGranted, qiblaData.isGeolocationSupported, qiblaData.isLoading, getUserLocation]);


  return qiblaData;
};
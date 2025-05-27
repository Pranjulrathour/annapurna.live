import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  error?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have saved location in localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Error parsing saved location:', e);
        // If there's an error parsing, we'll detect location again
        detectLocation();
      }
    } else {
      // No saved location, detect it
      detectLocation();
    }
  }, []);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates using reverse geocoding (optional)
      let address;
      try {
        // This is a simple example using a free service
        // In production, consider using a more reliable geocoding service
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        address = data.display_name;
      } catch (geocodeError) {
        console.error('Error getting address:', geocodeError);
        // Continue without address if geocoding fails
      }

      const locationData: LocationData = {
        latitude,
        longitude,
        address
      };

      // Save to localStorage
      localStorage.setItem('user_location', JSON.stringify(locationData));
      
      setLocation(locationData);
    } catch (err: any) {
      console.error('Error getting location:', err);
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    localStorage.removeItem('user_location');
    setLocation(null);
  };

  return {
    location,
    loading,
    error,
    detectLocation,
    clearLocation
  };
};

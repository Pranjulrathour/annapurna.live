import React, { createContext, useState, useContext, useEffect } from 'react';

interface LocationState {
  userLocation: { lat: number; lng: number } | null;
  locationAddress: string | undefined;
  searchRadius: number;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
  setSearchRadius: (radius: number) => void;
}

const LocationContext = createContext<LocationState | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get initial values from localStorage if they exist
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('annapurna_user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationAddress, setLocationAddress] = useState<string | undefined>(() => {
    return localStorage.getItem('annapurna_location_address') || undefined;
  });
  const [searchRadius, setSearchRadius] = useState<number>(() => {
    return parseInt(localStorage.getItem('annapurna_search_radius') || '25', 10);
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Save values to localStorage when they change
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('annapurna_user_location', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    if (locationAddress) {
      localStorage.setItem('annapurna_location_address', locationAddress);
    }
  }, [locationAddress]);

  useEffect(() => {
    localStorage.setItem('annapurna_search_radius', searchRadius.toString());
  }, [searchRadius]);

  const getCurrentLocation = async () => {
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
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      
      // Try to get the address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setLocationAddress(data.display_name);
        }
      } catch (addressError) {
        console.error('Error getting address:', addressError);
        // Don't set error state here since we at least have coordinates
      }

      return { lat: latitude, lng: longitude };
    } catch (error: any) {
      console.error('Location error:', error);
      setError(error.message || 'Failed to get your location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSetSearchRadius = (radius: number) => {
    setSearchRadius(radius);
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationAddress,
        searchRadius,
        loading,
        error,
        getCurrentLocation,
        setSearchRadius: handleSetSearchRadius,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

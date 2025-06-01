// File: /hooks/useGeolocation.js

import { fetchAddress as fallbackFetchAddress } from "@/utils/locationUtils";
import { useEffect, useState } from "react";
export const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    accuracy: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      setLoading(true);
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const address = await fallbackFetchAddress(latitude, longitude);
          setLocation({ latitude, longitude, accuracy, address, error: null });
          setLoading(false);
        },
        (error) => {
          setLocation((prev) => ({
            ...prev,
            error: error.message,
            address: "Lokasi tidak tersedia/error.",
            latitude: null,
            longitude: null,
            accuracy: null,
          }));
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        address: "Geolocation tidak didukung.",
      }));
      setLoading(false);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, loading };
};

import { useState, useEffect, useCallback } from "react";

export const useLocationTracking = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);

  const reverseGeocode = async (latitude, longitude) => {
    let locationData = null;

    try {
      // Coba OpenStreetMap Nominatim dulu
      const osmResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
        {
          headers: {
            "User-Agent": "TemuCerita-App/1.0",
          },
        }
      );
      const osmData = await osmResponse.json();

      locationData = {
        city:
          osmData.address?.city ||
          osmData.address?.town ||
          osmData.address?.municipality ||
          osmData.address?.village ||
          osmData.address?.suburb ||
          "Unknown",
        district:
          osmData.address?.suburb || osmData.address?.neighbourhood || "",
        state: osmData.address?.state || osmData.address?.province || "",
        country: osmData.address?.country || "",
        latitude,
        longitude,
        accuracy: Math.round(osmData.accuracy || 0),
        timestamp: new Date().toISOString(),
      };
    } catch (osmError) {
      console.log("OSM failed, trying alternative...");

      // Fallback ke BigDataCloud
      try {
        const bdcResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
        );
        const bdcData = await bdcResponse.json();

        locationData = {
          city:
            bdcData.city ||
            bdcData.locality ||
            bdcData.principalSubdivision ||
            "Unknown",
          district: bdcData.localityInfo?.administrative?.[3]?.name || "",
          state: bdcData.principalSubdivision || "",
          country: bdcData.countryName || "",
          latitude,
          longitude,
          accuracy: Math.round(bdcData.accuracy || 0),
          timestamp: new Date().toISOString(),
        };
      } catch (bdcError) {
        throw new Error("All geocoding services failed");
      }
    }

    return locationData;
  };

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung di browser ini");
      return;
    }

    setIsWatchingLocation(true);
    setLoading(true);

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const locationData = await reverseGeocode(latitude, longitude);
          locationData.accuracy = position.coords.accuracy;

          console.log("Location detected:", locationData);
          setUserLocation(locationData);
          setLocationError(null);
        } catch (error) {
          console.error("Geocoding error:", error);
          setLocationError("Gagal mendapatkan informasi lokasi");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Gagal mendapatkan lokasi";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Akses lokasi ditolak. Mohon izinkan akses lokasi di browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage = "Timeout mendapatkan lokasi.";
            break;
        }

        setLocationError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsWatchingLocation(false);
    };
  }, []);

  return {
    userLocation,
    loading,
    locationError,
    isWatchingLocation,
    startLocationTracking,
  };
};

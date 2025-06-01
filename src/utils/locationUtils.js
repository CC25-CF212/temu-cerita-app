// File: /utils/locationUtils.js

export const fetchAddress = async (latitude, longitude) => {
  if (latitude && longitude) {
    return `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
  }
  return "Alamat tidak tersedia";
};

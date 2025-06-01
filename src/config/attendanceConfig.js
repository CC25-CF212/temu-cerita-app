// File: /config/attendanceConfig.js

export const WORK_SCHEDULE = {
  masuk: { start: "06:00", end: "10:00", grace: 30 },
  pulang: { start: "15:00", end: "19:00" },
};

export const AVAILABLE_OFFICE_LOCATIONS = [
  {
    id: "jakarta_pusat",
    name: "Kantor Jakarta Pusat",
    latitude: -6.175392,
    longitude: 106.827153,
  },
  {
    id: "surabaya_timur",
    name: "Kantor Surabaya Timur",
    latitude: -7.257472,
    longitude: 112.75209,
  },
  {
    id: "remote_default",
    name: "Lokasi Lain (Remote/Manual)",
    latitude: 0,
    longitude: 0,
  },
];

export const OFFICE_LOCATION_RADIUS = 2000;

// File: /utils/attendanceUtils.js

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
    return Infinity;
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatTime = (date) =>
  date
    ? date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

export const formatDate = (date) =>
  date
    ? date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Memuat tanggal...";

export const validateTime = (now, attendanceType, WORK_SCHEDULE) => {
  if (!now) return { valid: false, status: "error_waktu" };
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const schedule = WORK_SCHEDULE[attendanceType];
  if (!schedule) return { valid: false, status: "error_jadwal" };

  const [startH, startM] = schedule.start.split(":").map(Number);
  const [endH, endM] = schedule.end.split(":").map(Number);
  const startTotalMinutes = startH * 60 + startM;
  let endTotalMinutesScheduled = endH * 60 + endM;
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  if (attendanceType === "masuk") {
    const graceMinutes = schedule.grace || 0;
    const endTotalMinutesWithGrace = endTotalMinutesScheduled + graceMinutes;
    return {
      valid:
        currentTotalMinutes >= startTotalMinutes &&
        currentTotalMinutes <= endTotalMinutesWithGrace,
      status:
        currentTotalMinutes > endTotalMinutesScheduled &&
        currentTotalMinutes <= endTotalMinutesWithGrace
          ? "terlambat_toleransi"
          : currentTotalMinutes > endTotalMinutesWithGrace
          ? "terlambat"
          : currentTotalMinutes >= startTotalMinutes
          ? "tepat_waktu"
          : "belum_waktunya",
    };
  } else {
    return {
      valid:
        currentTotalMinutes >= startTotalMinutes &&
        currentTotalMinutes <= endTotalMinutesScheduled,
      status:
        currentTotalMinutes < startTotalMinutes
          ? "terlalu_awal"
          : currentTotalMinutes <= endTotalMinutesScheduled
          ? "tepat_waktu"
          : "lewat_waktu",
    };
  }
};

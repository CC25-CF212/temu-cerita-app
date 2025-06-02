"use client";
import LogoutButton from "@/components/LogoutButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

// Definisi interface untuk data cuaca
interface WeatherData {
  locationName: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  visibility: number;
  wind: {
    speed: number;
  };
}

// Interface untuk koordinat lokasi
interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // States untuk cuaca
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Key - dalam production, simpan di environment variables
  const API_KEY = "512d04bd91e18517e3ff3492a1e1f653";

  const { data: session, status } = useSession();
  // Handle klik di luar area notifikasi untuk menutup panel
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session loaded:", session);
      console.log("Name:", session?.user?.name);
      console.log("Email:", session?.user?.email);
      console.log("Image URL:", session?.user?.image);
    }
  }, [session, status]);
  // Prevent hydration mismatch by only showing time on client
  useEffect(() => {
    setIsClient(true);
    // Auto get weather on component mount
    handleGetWeather();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".notification-dropdown") &&
        !target.closest(".notification-button")
      ) {
        setShowNotifications(false);
      }
      if (
        !target.closest(".profile-dropdown") &&
        !target.closest(".profile-button")
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Cerita baru tersedia",
      message: "Ada 5 cerita baru yang bisa kamu baca hari ini",
      time: "2 menit lalu",
      read: false,
    },
    {
      id: 2,
      title: "Komentar baru",
      message: "Seseorang mengomentari cerita kamu",
      time: "1 jam lalu",
      read: false,
    },
    {
      id: 3,
      title: "Update sistem",
      message: "TemuCerita telah diperbarui dengan fitur baru",
      time: "3 jam lalu",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Fungsi untuk mendapatkan lokasi user
  const getCurrentLocation = (): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  // Fungsi untuk fetch data cuaca
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Fungsi untuk mendapatkan nama lokasi dari koordinat
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      return data[0]?.name || "Unknown Location";
    } catch (error) {
      return "Unknown Location";
    }
  };

  // Handler untuk mendapatkan cuaca berdasarkan lokasi
  const handleGetWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Dapatkan lokasi user
      const coords = await getCurrentLocation();
      setLocation(coords);

      // Dapatkan data cuaca
      const weatherData = await fetchWeatherData(
        coords.latitude,
        coords.longitude
      );

      // Dapatkan nama lokasi
      const locationName = await getLocationName(
        coords.latitude,
        coords.longitude
      );

      setWeather({
        ...weatherData,
        locationName,
      });
    } catch (err: any) {
      setError(err.message || "Failed to get weather data");
    } finally {
      setLoading(false);
    }
  };

  // Function to display weather info
  const renderWeatherInfo = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-1">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <span className="text-sm">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={handleGetWeather}
        >
          <span>❌</span>
          <span className="text-sm hidden md:inline">Retry</span>
        </div>
      );
    }

    if (weather) {
      return (
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={handleGetWeather}
          title={`${weather.locationName} - ${weather.weather[0].description}`}
        >
          <span>🌤</span>
          <span className="text-sm hidden md:inline">
            {Math.round(weather.main.temp)}°C
          </span>
        </div>
      );
    }

    return (
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={handleGetWeather}
      >
        <span>🌤</span>
        <span className="text-sm hidden md:inline">--°C</span>
      </div>
    );
  };

  return (
    <>
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-emerald-50">
          <header className="bg-emerald-100 py-4 px-6 sticky top-0 z-50 shadow-md flex items-center justify-between">
            {/* Kiri: Judul */}
            <h1 className="text-2xl font-bold text-gray-900">TemuCerita</h1>

            {/* Kanan: Info */}
            <div className="flex items-center space-x-4 text-gray-700">
              {/* Tanggal & Jam dengan detik realtime */}
              <div className="text-sm whitespace-nowrap hidden md:block">
                {isClient ? (
                  <>
                    {currentTime.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    ,{" "}
                    {currentTime.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </>
                ) : (
                  <span className="opacity-0">Loading...</span>
                )}
              </div>

              {/* Cuaca */}
              {renderWeatherInfo()}

              {/* Notifikasi dengan dropdown */}
              <div className="relative">
                <button
                  className="notification-button relative hover:text-emerald-600 transition p-1 rounded-lg hover:bg-emerald-200"
                  onClick={handleNotificationClick}
                  title="Notifikasi"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
            6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67
            6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595
            1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Notifikasi */}
                {showNotifications && (
                  <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">
                        Notifikasi
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                !notif.read ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notif.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Lihat semua notifikasi
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dengan dropdown */}
              <div className="relative">
                <button
                  className="profile-button w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-semibold hover:bg-emerald-500 transition-colors"
                  onClick={handleProfileClick}
                  title="Profile"
                >
                  R
                </button>

                {/* Dropdown Profile */}
                {showProfileMenu && (
                  <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        {session?.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Profil Saya</span>
                      </button>
                      {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Pengaturan</span>
                      </button> */}
                      {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Bantuan</span>
                      </button> */}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      {/* <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Keluar</span>
                      </button> */}
                      <LogoutButton
                        redirectTo="/login"
                        variant="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        Keluar
                      </LogoutButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-emerald-700">
              <div className="md:fixed md:h-screen md:w-64">
                <div className="h-full">
                  <div id="sidemenu-container" className="h-full" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <AuthProvider>{children}</AuthProvider>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

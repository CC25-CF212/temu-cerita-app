import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Edit, User, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const notificationRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogoutConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, logoutRef, session]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotificationCount(0);
    }
  };
  const toggleLogoutConfirm = () => {
    setShowLogoutConfirm(!showLogoutConfirm);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      // Optional: handle any additional cleanup
      //localStorage.removeItem("user_preferences");

      // Redirect to login page
      router.push("/pages/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b ${
          darkMode
            ? "border-gray-700 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-black"
        }`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center">
            <Link href="/pages">
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                TemuCerita
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-full border ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-black"
                } 
                  py-2 pl-4 pr-10 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-gray-600" : "focus:ring-gray-300"
                  }`}
              />
              <div className="absolute right-3 top-2.5">
                <Search size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifikasi */}
            {/* <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button> */}

            {/* Panel Notifikasi */}
            {/* {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg z-50 overflow-hidden">
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <div
                      className={`py-2 px-4 font-medium ${
                        darkMode
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                      }`}
                    >
                      <h3>Notifikasi</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div
                        className={`p-3 ${
                          darkMode
                            ? "border-b border-gray-700 hover:bg-gray-700"
                            : "border-b border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-sm">
                          Cerita Anda mendapat 5 like baru
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mt-1`}
                        >
                          2 jam yang lalu
                        </p>
                      </div>
                      <div
                        className={`p-3 ${
                          darkMode
                            ? "border-b border-gray-700 hover:bg-gray-700"
                            : "border-b border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-sm">
                          Pengguna @user123 mengikuti Anda
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mt-1`}
                        >
                          Kemarin
                        </p>
                      </div>
                      <div
                        className={`p-3 ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-sm">
                          Cerita baru dari penulis yang Anda ikuti
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mt-1`}
                        >
                          3 hari yang lalu
                        </p>
                      </div>
                    </div>
                    <div
                      className={`py-2 px-4 text-center ${
                        darkMode
                          ? "border-t border-gray-700"
                          : "border-t border-gray-200"
                      }`}
                    >
                      <Link
                        href="/notifications"
                        className={`text-sm ${
                          darkMode ? "text-blue-400" : "text-blue-500"
                        } hover:underline`}
                      >
                        Lihat semua notifikasi
                      </Link>
                    </div>
                  </div>
                </div>
              )} */}
            {/* </div> */}

            <Link
              href="/pages/article/post"
              className={`flex items-center gap-2 ${
                darkMode ? "hover:text-gray-300" : "hover:text-gray-600"
              }`}
            >
              <Edit size={20} />
              <span className="hidden sm:inline">Write</span>
            </Link>

            <Link href="/pages/profile">
              <div
                className={`w-8 h-8 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } overflow-hidden cursor-pointer flex items-center justify-center`}
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={20}
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  />
                )}
              </div>
            </Link>
            <div className="relative" ref={logoutRef}>
              <button
                onClick={toggleLogoutConfirm}
                className={`flex items-center gap-2 ${
                  darkMode ? "hover:text-gray-300" : "hover:text-gray-600"
                }`}
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
              {showLogoutConfirm && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg z-50 overflow-hidden">
                  <div
                    className={`p-4 ${
                      darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <h3 className="font-medium mb-2">Konfirmasi Logout</h3>
                    <p className="text-sm mb-4">
                      Apakah Anda yakin ingin keluar dari akun?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className={`px-3 py-1 rounded text-sm ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
};

export default Header;

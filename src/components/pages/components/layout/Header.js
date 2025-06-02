import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Edit,
  User,
  Bell,
  Moon,
  Sun,
  LogOut,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ Ambil status juga

  // ✅ SEMUA HOOKS HARUS DIPANGGIL SEBELUM CONDITIONAL RETURN
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const notificationRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutRef = useRef(null);

  // ✅ useEffect HARUS SELALU DIPANGGIL
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

    // Hanya add event listener jika session ada
    if (session) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [session]);

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
      router.push("/pages/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ KONDISI LOADING - RETURN NULL (TIDAK RENDER APAPUN)
  if (status === "loading") {
    return null; // Atau bisa return skeleton loader minimal
  }

  // ✅ KONDISI UNAUTHENTICATED - TAMPILKAN LOGIN/REGISTER
  if (status === "unauthenticated") {
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
              <Link href="/">
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  TemuCerita
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/pages/login"
                className={`px-4 py-2 rounded-md border ${
                  darkMode
                    ? "border-gray-600 text-white hover:bg-gray-800"
                    : "border-gray-300 text-black hover:bg-gray-50"
                } transition-colors`}
              >
                Login
              </Link>

              <Link
                href="/pages/daftar"
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } transition-colors`}
              >
                Register
              </Link>
            </div>
          </div>
        </header>
        <div className="h-20"></div>
      </>
    );
  }

  // ✅ KONDISI AUTHENTICATED - TAMPILKAN HEADER LENGKAP
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

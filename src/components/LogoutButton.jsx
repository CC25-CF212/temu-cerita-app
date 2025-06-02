// components/LogoutButton.jsx
import { useLogout } from "@/hooks/useLogout";
import LogoutConfirmModal from "./LogoutConfirmModal";

const LogoutButton = ({
  children,
  className = "",
  variant = "button", // "button", "link", "icon"
  redirectTo = "/login", // tambahan parameter untuk redirect
}) => {
  const {
    showLogoutModal,
    isLoggingOut,
    handleLogoutClick,
    handleLogoutConfirm,
    handleLogoutCancel,
  } = useLogout(redirectTo);

  const baseClasses = "cursor-pointer";
  const variantClasses = {
    button:
      "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
    link: "text-red-500 hover:text-red-700 underline",
    icon: "p-2 hover:bg-gray-100 rounded-full transition-colors",
  };

  return (
    <>
      {/* <div
        onClick={handleLogoutClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children || "Logout"}
      </div> */}
      <button onClick={handleLogoutClick} className={`${className}`}>
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
        <span>{children || "Logout"}</span>
      </button>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default LogoutButton;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
      <span className="ml-2 text-white">Loading...</span>
    </div>
  );
};

// Button Loading Component
const ButtonContent = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return "Login";
};

// Overlay Loading Component
const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-teal-600 bg-opacity-80 flex items-center justify-center rounded-lg z-10">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Authenticating...</p>
        <div className="mt-2">
          <div className="flex space-x-1 justify-center">
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result!.error) {
        setError(result!.error);
        setIsLoading(false);
      } else {
        // disable jika menggunkan context library
        login(result);
        // Redirect immediately without delay and refresh
        router.push("/admin/dashboard");
        // Keep loading true until redirect completes naturally
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-lg bg-teal-600 rounded-lg p-12 shadow-lg relative">
        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay />}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Log in Admin</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Input email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Input password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-500 min-h-12 flex items-center justify-center"
          >
            <ButtonContent isLoading={isLoading} />
          </button>
        </form>
      </div>
    </div>
  );
}

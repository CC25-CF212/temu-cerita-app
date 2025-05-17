"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    console.log("Login data:", { email, password });

    router.push("/admin/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-lg bg-teal-600 rounded-lg p-12 shadow-lg">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              placeholder="Input email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              placeholder="Input password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-200 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white flex w-full max-w-4xl rounded-2xl shadow-md overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
          <p className="text-gray-600 mt-2 mb-6">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Input email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Input password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Don't have account ?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className="hidden md:block md:w-1/2 bg-gray-300 rounded-r-2xl"></div>
      </div>
    </div>
  )
}

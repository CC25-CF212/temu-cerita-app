// /auth.js (in the root directory)
// This file is the main configuration for NextAuth with App Router

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/pages/login",
    signOut: "/pages/login",
    error: "/pages/login",
  },
  // Adjust these options as needed
  secret: process.env.NEXTAUTH_SECRET,
  // Configure providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const baseUrl = process.env.NEXTAUTH_URL;
          const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const hasil = await response.json();
          if (response.ok && hasil.data) {
            return {
              id: hasil.data.id,
              name: hasil.data.name,
              email: hasil.data.email,
              image: hasil.data.profile_picture || null,
              apiToken: "11111111xxx",
            };
          }
          throw new Error(hasil.message || "Authentication failed");
        } catch (error) {
          console.error("NextAuth Error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    // Add custom properties to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.apiToken = user.apiToken;
      }
      return token;
    },

    // Add custom properties to the session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.apiToken = token.apiToken;
      return session;
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
};

// For App Router, we need to export the handlers this way
const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };

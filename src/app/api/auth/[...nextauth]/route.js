// /app/api/auth/[...nextauth]/route.js

// This is where the NextAuth API routes are defined in App Router
export { GET, POST } from "../../../../auth";

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// const authOptions = {
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   pages: {
//     signIn: "/pages/login",
//     signOut: "/pages/login",
//     error: "/pages/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const baseUrl = process.env.NEXTAUTH_URL;
//           const response = await fetch(`${baseUrl}/api/auth/login`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           });

//           const hasil = await response.json();
//           console.log("Authorize response:", hasil); // Debug

//           if (response.ok && hasil.data) {
//             const userData = {
//               id: hasil.data.id.toString(), // Pastikan string
//               name: hasil.data.name,
//               email: hasil.data.email,
//               image: "/images/gambar.png",
//               admin: hasil.data.admin,
//               apiToken: hasil.data.token,
//             };
//             console.log("Returning user data:", userData); // Debug
//             return userData;
//           }
//           throw new Error(hasil.message || "Authentication failed");
//         } catch (error) {
//           console.error("NextAuth Error:", error);
//           return null; // Return null instead of throwing
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       console.log("=== SIGN IN CALLBACK ===");
//       console.log("User:", user);
//       console.log("Account:", account); // Debugging output
//       console.log("Profile:", profile); // Debugging output
//       // Your Google sign in logic...
//       return true;
//     },
//     async jwt({ token, user, account }) {
//       console.log("=== JWT CALLBACK ===");
//       console.log("User:", user);
//       console.log("Account:", account);
//       console.log("Token before:", token);

//       // Hanya saat first login (user object ada)
//       if (user && account) {
//         token.id = user.id;
//         token.admin = user.admin;
//         token.apiToken = user.apiToken;
//         console.log("Saved to token:", {
//           admin: user.admin,
//           apiToken: user.apiToken,
//         });
//       }

//       console.log("Token after:", token);
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("=== SESSION CALLBACK ===");
//       console.log("Token:", token);

//       if (session.user) {
//         session.user.id = token.id;
//         session.user.admin = token.admin;
//         session.user.apiToken = token.apiToken;
//       }

//       console.log("Final session:", session);
//       return session;
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

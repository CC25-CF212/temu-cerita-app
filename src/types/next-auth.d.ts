// types/next-auth.d.ts (di root atau src/types/)
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      admin?: boolean;
      apiToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    admin?: boolean;
    apiToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    admin?: boolean;
    apiToken?: string;
  }
}

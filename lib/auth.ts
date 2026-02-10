import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Configure Session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Define pages for redirects
  pages: {
    signIn: "/login", // Redirect here if unauthorized
    error: "/login", // Redirect here on error
  },

  //  Define Providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // After client calls /api/auth/login, we pass token + userPayload to avoid calling external API again
        token: { label: "Access Token", type: "text" },
        userPayload: { label: "User Payload", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const token = credentials.token as string | undefined;
        const userPayload = credentials.userPayload as string | undefined;

        // Path 1: Client already logged in via /api/auth/login and passed token + user
        if (token && userPayload) {
          try {
            const user = JSON.parse(userPayload) as { id?: string; email?: string; name?: string };
            if (user?.email) {
              return {
                id: String(user.id ?? "1"),
                email: user.email,
                name: user.name ?? user.email,
                accessToken: token,
              };
            }
          } catch {
            // invalid JSON, fall through to path 2
          }
        }

        // Path 2: Classic email + password (e.g. direct signIn from form without going through /api/auth/login)
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password) return null;

        const apiUrl = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
        if (!apiUrl) {
          console.error("Auth: API_URL or NEXT_PUBLIC_API_URL is not set");
          return null;
        }

        const loginUrl = `${apiUrl}/admin-api/auth/login/`;

        try {
          const res = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const contentType = res.headers.get("content-type");
          const rawBody = await res.text();

          if (!contentType?.includes("application/json")) {
            console.error("Auth API non-JSON:", res.status, rawBody.substring(0, 300));
            return null;
          }

          let data: Record<string, unknown>;
          try {
            data = JSON.parse(rawBody) as Record<string, unknown>;
          } catch {
            console.error("Auth API invalid JSON:", rawBody.substring(0, 300));
            return null;
          }

          if (!res.ok) {
            console.error("Auth API error:", res.status, (data?.detail as string) ?? (data?.message as string));
            return null;
          }

          const user = (data.user ?? data) as Record<string, unknown>;
          const firstName = (user.firstname ?? user.first_name) as string | undefined;
          const lastName = (user.lastname ?? user.last_name) as string | undefined;
          const accessToken = (data.access ?? data.access_token) as string | undefined;

          if (!user?.email || !accessToken) {
            console.error("Auth API success but missing user/token. Keys:", Object.keys(data));
            return null;
          }

          return {
            id: String(user.id ?? "1"),
            email: user.email as string,
            name: [firstName, lastName].filter(Boolean).join(" ") || (user.name as string) || (user.email as string),
            accessToken,
          };
        } catch (error) {
          console.error("Login request failed:", error);
          return null;
        }
      },
    }),
  ],

  //  Callbacks to handle token persistence
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  
  // Secret key (Make sure NEXTAUTH_SECRET is in your .env)
  secret: process.env.NEXTAUTH_SECRET,
};
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Hit Backend API
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin-api/auth/login/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            // Throwing an error here will redirect to the error page with the message
            throw new Error(data?.detail || "Invalid credentials");
          }

          // Return the object that matches the `User` interface in types
          // Adjust 'data.user' fields based on exactly what your API returns
          return {
            id: data.user.id || "1", // Ensure ID exists
            email: data.user.email,
            name: `${data.user.firstname} ${data.user.lastname}`,
            accessToken: data.access, // Storing the JWT access token
          };
        } catch (error) {
          console.error("Login Failed:", error);
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
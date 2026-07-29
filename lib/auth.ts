import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuthのオプション設定
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const backendApiUrl =
            process.env.BACKEND_API_URL ??
            "http://127.0.0.1:5000";

          const res = await fetch(
            `${backendApiUrl}/api/admin/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
              cache: "no-store",
            },
          );

          if (!res.ok) {
            return null;
          }

          const token = await res.json();

          if (!token) {
            return null;
          }

          return token;
        } catch (error) {
          console.error(
            "★★★ バックエンドAPIとの通信エラー詳細 ★★★",
            error,
          );

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user =
        token as typeof session.user;

      return session;
    },
  },
};
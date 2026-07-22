import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
/**
 * NextAuthのオプション設定
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // 入力フォームを定義する(APIのキー名に合わせる)
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // 認証ロジックの実装
      async authorize(credentials) {
        try {
          // バックエンドAPIへ認証リクエストを送信
          const res = await fetch("http://20.78.59.178/api/admin/login", {
            method: "POST",
            // APIの仕様に合わせる
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const token = await res.json();
          // 認証成功(トークンが含まれている)ならユーザーオブジェクトを返す
          if (res.ok && token) {
            return token;
          }
          // 認証失敗
          return null;
        } catch (error) {
          console.error("★★★ バックエンドAPIとの通信エラー詳細 ★★★", error);
          return null; // 認証失敗として扱う
        }
      },
    }),
  ],
  callbacks: {
    // サーバーから届いたデータを封筒(token)に入れる
    async jwt({ token, user }) {
      if (user) {
        // user(authorizeの戻り値)をすべてtokenにコピーする
        return { ...token, ...user };
      }
      return token;
    },
    //  封筒(token)の中身を使えるように公開(session)する
    async session({ session, token }) {
      // トークンの全内容をセッションのuserプロパティに詰め替える
      session.user = token as any;
      return session;
    },
  },
};

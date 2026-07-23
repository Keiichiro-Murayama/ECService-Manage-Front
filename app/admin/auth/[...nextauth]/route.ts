import NextAuth from "next-auth";
// 認証ロジックの設定ファイル(lib/auth.ts)をインポート
import { authOptions } from "@/lib/auth";
/**
 * 演習 7-2 NextAuth.jsの導入と環境構築
 * NextAuthのAPIルートハンドラー
 */
const handler = NextAuth(authOptions);
// Next.jsの仕様に基づき、GETとPOSTメソッドを公開
export { handler as GET, handler as POST };

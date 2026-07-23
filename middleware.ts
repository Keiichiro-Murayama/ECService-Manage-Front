import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";
import { withAuth } from "next-auth/middleware";
/**
 * ミドルウェアを実装する
 * ここでは、ログインしていない場合にログイン画面へリダイレクトする処理を行う
 * withAuth()を使うことで、ログインしていない場合に自動でリダイレクトされる
 * リダイレクト先は、withAuth()の引数で指定する
 * matcherで、ミドルウェアを適用するパスを指定する
 * 今回は、ログイン画面以外のすべてのパスにミドルウェアを適用する
 */
// ミドルウェアの処理と、未ログイン時のリダイレクト先を指定
const authMiddleware = withAuth({
  pages: {
    signIn: "/api/login", // ログイン画面のパスを指定
  },
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // 開発中は認証チェックをスキップする
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  return authMiddleware(req as any, event);
}

export const config = {
  matcher: ["/((?!api/login|api/auth|_next/static|_next/image|favicon.ico).*)"], // ミドルウェアを適用するパスを指定
};

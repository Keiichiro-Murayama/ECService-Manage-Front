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
export default withAuth({
  pages: {
    signIn: "/api/login", // ログイン画面のパスを指定
  },
});
export const config = {
  matcher: ["/((?!api/login|_next/static|_next/image|favicon.ico).*)"], // ミドルウェアを適用するパスを指定
};

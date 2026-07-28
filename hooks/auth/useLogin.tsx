import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

/**
 * ログインフォームの状態とロジックを管理するカスタムフック
 *
 * ログインはAuth.jsのsignIn(Credentials プロバイダ)で行う。
 * signInは内部で auth.tsのauthorize を実行し、その中でC#のログインAPIへリクエストする
 *
 * ログイン成功後、バックエンドから取得した JWT を access_token Cookie に保存し、
 * 以降の API 呼び出し（/proxy-api/*）で credentials: include で自動送信される
 */
export function useLogin() {
  const router = useRouter();

  // --- 入力値の状態 ---
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");

  // --- 補助状態 ---
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ログインを実行する
   * 入力チェック → Auth.jsのsignIn → JWT を access_token Cookie に保存 → 遷移/エラー表示
   */
  const submit = async () => {
    setError(null);

    /**以下のバリデーションはFormタグ内のバリデーションが優先される */
    // 入力チェック:どちらか空なら API を呼ばずに促す
    if (!accountName.trim()) {
      setError("アカウント名を入力してください。");
      return;
    }
    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }
    //アカウント名とパスワードが5文字以上20文字以内であることを確認
    if (accountName.trim().length < 5 || accountName.trim().length > 20) {
      setError("アカウント名は5文字以上20文字以内で入力してください。");
      return;
    }
    if (password.length < 5 || password.length > 20) {
      setError("パスワードは5文字以上20文字以内で入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        username: accountName.trim(),
        password,
        redirect: false,
      });

      console.log("signIn result:", result);

      if (!result || result.error) {
        setError("アカウント名またはパスワードが正しくありません。");
        return;
      }

      // NextAuth セッションから JWT トークンを取得して access_token Cookie に保存
      // バックエンドは JWT Cookie ("access_token") で認証するため、
      // NextAuth が保持するトークンをブラウザの Cookie に保存する
      const session = await getSession();
      if (session?.user) {
        // バックエンド API の認証レスポンス構造に応じて JWT を取出
        // 一般的な C# API は accessToken / token / jwtToken のいずれかのキーを返す
        const tokenValue =
          (session.user as any).accessToken ||
          (session.user as any).token ||
          (session.user as any).jwtToken;

      if (tokenValue && typeof tokenValue === "string") {
        // JWT を access_token Cookie に保存
        // path=/: サイト全体で有効
        // SameSite=Lax: 同一サイト内でのフォーム送信時に Cookie を送信
        // ブラウザの credentials: include でクロスオリジン送信時も送信される
        document.cookie = `access_token=${tokenValue}; path=/; SameSite=Lax`;
      }

      router.push("/");
    } catch (e) {
      console.error("ログインエラー:", e);
      setError("ログインに失敗しました。しばらくしてからお試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    accountName,
    setAccountName,
    password,
    setPassword,
    submitting,
    error,
    submit,
  };
}

type SessionUserWithToken = {
  accessToken?: string;
  token?: string;
  jwtToken?: string;
};

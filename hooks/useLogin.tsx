import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

/**
 * ログインフォームの状態とロジックを管理するカスタムフック
 *
 * ログインはAuth.jsのsignIn(Credentials プロバイダ)で行う。
 * signInは内部で auth.tsのauthorize を実行し、その中でC#のログインAPIへリクエストする
 */
export function useLogin() {
  const router = useRouter();

  // --- 入力値の状態 ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --- 補助状態 ---
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ログインを実行する
   * 入力チェック → Auth.jsのsignIn → 結果に応じて遷移/エラー表示
   */
  const submit = async () => {
    setError(null);

    // 入力チェック:どちらか空なら API を呼ばずに促す
    if (!username.trim() || !password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/proxy-api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        // C# 側で認証失敗(401 など)
        setError("ユーザー名またはパスワードが正しくありません。");
        return;
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ログイン状態の確立に失敗しました。");
        return;
      }

      toast.success("ログインしました。");
      router.push("/");
    } catch (e) {
      console.error("ログインエラー:", e);
      setError("ログインに失敗しました。しばらくしてからお試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    submitting,
    error,
    submit,
  };
}

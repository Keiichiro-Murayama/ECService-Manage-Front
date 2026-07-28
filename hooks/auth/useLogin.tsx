import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

/**
 * ログインフォームの状態とロジックを管理するカスタムフック
 */
export function useLogin() {
  const router = useRouter();

  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ログインを実行する
   */
  const submit = async () => {
    setError(null);

    if (!accountName.trim()) {
      setError("アカウント名を入力してください。");
      return;
    }

    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }

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

      const session = await getSession();

      if (session?.user) {
        const tokenValue = session.user.token;

        if (typeof tokenValue === "string") {
          document.cookie = `access_token=${tokenValue}; path=/; SameSite=Lax`;
        }
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
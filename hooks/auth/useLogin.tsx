import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);

    if (!username.trim() || !password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!result) {
        setError("ログイン処理に失敗しました。");
        return;
      }

      if (result.error) {
        setError("ユーザー名またはパスワードが正しくありません。");
        return;
      }

      router.push(result.url ?? "/");
      router.refresh();
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
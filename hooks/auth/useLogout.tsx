import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * ログアウト処理を行うカスタムフック
 *
 * ログアウトはAuth.jsのsignOutで行う。
 * signOutは内部で auth.tsのlogout を実行し、その中でC#のログアウトAPIへリクエストする
 *
 * また、ログイン時に保存した access_token Cookie をクリアする
 */
export function useLogout() {
  const router = useRouter();

  /**
   * ログアウトを実行する
   * Auth.jsのsignOut → access_token Cookie をクリア → ログイン画面へ遷移
   */
  const logout = async () => {
    try {
      // 1. Auth.jsのサインアウト処理（C# API連携含む）の完了を待つ
      await signOut({ redirect: false });

      // 2. ログイン時に保存した access_token Cookie をクリア
      // 有効期限を過去に設定することで削除
      document.cookie = "access_token=; path=/; Max-Age=0";

      // 3. ログアウト完了フラグをクエリで渡してログイン画面へ遷移する
      router.push("/admin/login?loggedOut=1");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      toast.error("ログアウトに失敗しました。");
    }
  };

  return { logout };
}

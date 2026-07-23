import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * ログアウト処理を行うカスタムフック
 *
 * ログアウトはAuth.jsのsignOutで行う。
 * signOutは内部で auth.tsのlogout を実行し、その中でC#のログアウトAPIへリクエストする
 */
export function useLogout() {
  const router = useRouter();

  /**
   * ログアウトを実行する
   * Auth.jsのsignOut → 結果に応じて遷移/エラー表示
   */
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/api/login");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      toast.error("ログアウトに失敗しました。");
    }
  };

  return { logout };
}

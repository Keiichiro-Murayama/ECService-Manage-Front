// components/auth/LoginForm.tsx
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  /** ユーザー名(入力欄の現在値) */
  username: string;
  /** パスワード(入力欄の現在値) */
  password: string;
  /** ログイン処理の実行中フラグ */
  submitting: boolean;
  /** エラーメッセージ(あれば表示する) */
  error: string | null;
  /** ユーザー名入力の変更を親へ通知する */
  onUsernameChange: (value: string) => void;
  /** パスワード入力の変更を親へ通知する */
  onPasswordChange: (value: string) => void;
  /** ログイン実行を親へ通知する */
  onSubmit: () => void;
};

/**
 * ログインフォームの見た目を担うコンポーネント
 * ユーザー名・パスワードの入力欄、ログインボタン、エラー表示を持つ
 */
export function LoginForm({
  username,
  password,
  submitting,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-5">
      {/* ユーザー名 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">ユーザー名</label>
        <Input
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="username"
        />
      </div>
      {/* パスワード */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">パスワード</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="current-password"
        />
      </div>
      {/* エラーメッセージ */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* ログインボタン */}
      <Button onClick={onSubmit} disabled={submitting} className="w-full">
        <LogIn className="mr-1 h-4 w-4" />
        {submitting ? "ログイン中..." : "ログイン"}
      </Button>
    </div>
  );
}

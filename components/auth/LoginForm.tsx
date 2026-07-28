// components/auth/LoginForm.tsx
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  /** アカウント名(入力欄の現在値) */
  accountName: string;
  /** パスワード(入力欄の現在値) */
  password: string;
  /** ログイン処理の実行中フラグ */
  submitting: boolean;
  /** エラーメッセージ(あれば表示する) */
  error: string | null;
  /** アカウント名入力の変更を親へ通知する */
  onAccountNameChange: (value: string) => void;
  /** パスワード入力の変更を親へ通知する */
  onPasswordChange: (value: string) => void;
  /** ログイン実行を親へ通知する */
  onSubmit: () => void;
};

/**
 * ログインフォームの見た目を担うコンポーネント
 * アカウント名・パスワードの入力欄、ログインボタン、エラー表示を持つ
 */
export function LoginForm({
  accountName,
  password,
  submitting,
  error,
  onAccountNameChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/* アカウント名 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="username">
          アカウント名
        </label>
        <Input
          id="username"
          value={accountName}
          onChange={(e) => onAccountNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="username"
          required
          minLength={5}
          maxLength={20}
          pattern="[a-zA-Z0-9]+"
          title="アカウント名は半角英数字で5~20文字で入力してください。"
        />
      </div>
      {/* パスワード */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="password">
          パスワード
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="current-password"
          required
          minLength={5}
          maxLength={20}
          title="パスワードは5~20文字で入力してください。"
        />
      </div>
      {/* エラーメッセージ */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* ログインボタン */}
      <Button type="submit" disabled={submitting} className="w-full">
        <LogIn className="mr-1 h-4 w-4" />
        {submitting ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
}

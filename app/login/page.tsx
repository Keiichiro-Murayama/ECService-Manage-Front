"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";
import { Library } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

/**
 * ログインページ
 */
export default function LoginPage() {
  const login = useLogin();

  return (
    <div className="mx-auto max-w-md py-8">
      {/* タイトル */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <Library className="h-10 w-10 text-slate-700" />
        <h1 className="text-2xl font-bold tracking-tight">ログイン</h1>
        <p className="text-sm text-muted-foreground">
          管理者システムにログインしてください。
        </p>
      </div>

      {/* ログインフォームをカードで囲む */}
      <Card className="p-6">
        <LoginForm
          username={login.username}
          password={login.password}
          submitting={login.submitting}
          error={login.error}
          onUsernameChange={login.setUsername}
          onPasswordChange={login.setPassword}
          onSubmit={login.submit}
        />
      </Card>
    </div>
  );
}

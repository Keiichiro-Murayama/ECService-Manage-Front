"use client";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";
import { useLogin } from "@/hooks/auth/useLogin";

/**
 * ログインページ
 */
function LoginPageContent() {
  const login = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandledLogoutToast = useRef(false);

  useEffect(() => {
    if (
      searchParams.get("loggedOut") === "1" &&
      !hasHandledLogoutToast.current
    ) {
      hasHandledLogoutToast.current = true;
      toast.success("ログアウトしました。", { duration: 2000 });
      router.replace("/admin/login");
    }
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-md items-center justify-center py-30">
      {/* ログインフォームをカードで囲む */}
      <Card className="p-6">
        <div className="space-y-1.5 py-4 text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <span className="text-sm text-center text-muted-foreground">
            管理者システムにログインします。
          </span>
        </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

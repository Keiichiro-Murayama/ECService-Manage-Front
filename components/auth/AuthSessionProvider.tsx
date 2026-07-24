'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * Auth.js のセッションをアプリ全体に提供するラッパー
 * SessionProviderはクライアントコンポーネントのため、サーバーコンポーネントであるlayout.tsxから使えるよう、
 * 'use client'を付けたこのラッパー経由で読み込む
 */
export function AuthSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return <SessionProvider>{children}</SessionProvider>
}
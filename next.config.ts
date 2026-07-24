import type { NextConfig } from "next";
/**
 * APIプロキシ(BFF)の設定を追加する
 * Next.js プロジェクトの設定ファイル
 * ブラウザのセキュリティ制限（CORS）を回避し、フロントエンドから
 * 安全にバックエンドAPIを呼び出すための中継ルールを定義
 */
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        /**
         * 管理者API用のプロキシ設定
         * source: フロントエンド側で呼び出すURL（相対パス）
         * destination: 実際にデータを取得しに行くバックエンドURL
         * ※画面（/api/users/register）とのURL衝突を避けるため、
         *   API専用の入り口として「/proxy-api/」を冠しています。
         */
        source: "/proxy-api/:path*",
        destination: "http://20.78.59.178/api/admin/:path*",
      },
    ];
  },
};
export default nextConfig;

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * バックエンドAPIのベースURL
 *
 * Azure VM上では、Nginxを経由せずASP.NETへ直接接続する。
 */
const backendApiUrl =
    process.env.BACKEND_API_URL ??
    "http://127.0.0.1:5000";

/**
 * Next.jsからASP.NET APIへリクエストを中継する
 *
 * @param request フロントエンドからのリクエスト
 * @param context 動的ルートの情報
 * @returns バックエンドAPIのレスポンス
 */
const proxyRequest = async (
    request: NextRequest,
    context: {
        params: Promise<{
            path: string[];
        }>;
    },
): Promise<NextResponse> => {
    /*
     * NextAuthのセッションCookieを復号し、
     * JWTに保存されている情報を取得する。
     */
    const nextAuthToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    /*
     * auth.tsでauthorize()の戻り値をJWTへ展開しているため、
     * バックエンドのJWTはtokenプロパティに保存されている。
     */
    const accessToken = nextAuthToken?.token;

    if (
        typeof accessToken !== "string" ||
        accessToken.trim() === ""
    ) {
        return NextResponse.json(
            {
                message:
                    "認証情報を取得できません。再度ログインしてください。",
            },
            {
                status: 401,
            },
        );
    }

    const { path } = await context.params;

    /*
     * /proxy-api/products
     *        ↓
     * /api/admin/products
     */
    const backendUrl = new URL(
        `/api/admin/${path.join("/")}`,
        backendApiUrl,
    );

    // categoryUuidなどのクエリパラメータを引き継ぐ
    backendUrl.search =
        request.nextUrl.search;

    const headers = new Headers();

    /*
     * リクエストのContent-Typeを引き継ぐ。
     *
     * multipart/form-dataの場合もboundaryを含めた値を
     * そのまま転送する必要がある。
     */
    const contentType =
        request.headers.get("content-type");

    if (contentType) {
        headers.set(
            "Content-Type",
            contentType,
        );
    }

    const accept =
        request.headers.get("accept");

    if (accept) {
        headers.set("Accept", accept);
    }

    /*
     * NextAuthのCookieに保存されていたJWTを、
     * ASP.NETが認証できるBearerトークンとして付与する。
     */
    headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
    );

    const hasBody =
        request.method !== "GET" &&
        request.method !== "HEAD";

    try {
        const backendResponse =
            await fetch(backendUrl, {
                method: request.method,
                headers,
                body: hasBody
                    ? await request.arrayBuffer()
                    : undefined,
                cache: "no-store",
            });

        const responseHeaders =
            new Headers();

        const responseContentType =
            backendResponse.headers.get(
                "content-type",
            );

        if (responseContentType) {
            responseHeaders.set(
                "Content-Type",
                responseContentType,
            );
        }

        return new NextResponse(
            backendResponse.body,
            {
                status: backendResponse.status,
                headers: responseHeaders,
            },
        );
    } catch (error) {
        console.error(
            "バックエンドAPIへの接続に失敗しました。",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "バックエンドAPIとの通信に失敗しました。",
            },
            {
                status: 502,
            },
        );
    }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
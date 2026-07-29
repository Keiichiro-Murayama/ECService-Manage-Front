import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            accessToken: string;
            accountUuid: string;
            accountName: string;
        } & DefaultSession["user"];
    }

    interface User {
        accessToken: string;
        accountUuid: string;
        accountName: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
        accountUuid: string;
        accountName: string;
    }
}

export { };
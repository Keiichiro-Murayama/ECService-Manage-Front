import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            token?: string;
            accountUuid?: string;
            accountName?: string;
            message?: string;
        };
    }

    interface User {
        token?: string;
        accountUuid?: string;
        accountName?: string;
        message?: string;
    }
}
// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/register",
    },

    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const loggedIn = !!auth?.user;

            const isProtected =
                nextUrl.pathname.startsWith("/history") ||
                nextUrl.pathname.startsWith("/") ||
                nextUrl.pathname.startsWith("/profile");

            // 1️⃣ Not logged in → redirect to /register
            if (isProtected && !loggedIn) {
                return false; // middleware sends to signIn page
            }

            // 2️⃣ Logged-in users should not see /register or /login
            if (loggedIn) {
                if (
                    nextUrl.pathname === "/login" ||
                    nextUrl.pathname === "/register"
                ) {
                    return Response.redirect(new URL("/", nextUrl));
                }
            }

            return true;
        },
    },

    // ✅ REQUIRED by NextAuthConfig
    providers: [],
} satisfies NextAuthConfig;

// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function getUser(email: string) {
    try {
        return await prisma.user.findUnique({ where: { email } });
    } catch (err) {
        console.error("Failed to fetch user:", err);
        throw new Error("Failed to fetch user.");
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                const user = await getUser(email);
                if (!user) return null;

                const match = await bcrypt.compare(password, user.password);
                if (!match) return null;

                return user;
            },
        }),
    ],
});

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z.string().optional(),
    password: z.string().min(6).optional(),
});

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, password } = updateProfileSchema.parse(body);

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: dataToUpdate,
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
}

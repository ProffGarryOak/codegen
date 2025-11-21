import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const [data, count] = await prisma.$transaction([
            prisma.generation.findMany({
                where: { user_id: user.id },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: { languages: true },
            }),
            prisma.generation.count({
                where: { user_id: user.id },
            }),
        ]);

        // Handle BigInt serialization
        const serializedData = data.map(gen => ({
            ...gen,
            language_id: Number(gen.language_id),
            languages: {
                ...gen.languages,
                id: Number(gen.languages.id)
            }
        }));

        return NextResponse.json({
            data: serializedData,
            meta: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error('History error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

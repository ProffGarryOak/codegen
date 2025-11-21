import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const [data, count] = await prisma.$transaction([
            prisma.generation.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: { languages: true },
            }),
            prisma.generation.count(),
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

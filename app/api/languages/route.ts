import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const data = await prisma.language.findMany({
            orderBy: { name: 'asc' },
        });

        // Handle BigInt serialization
        const serializedData = data.map(lang => ({
            ...lang,
            id: Number(lang.id)
        }));

        return NextResponse.json(serializedData);
    } catch (error) {
        console.error('Languages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, language_slug } = await request.json();

        if (!prompt || !language_slug) {
            return NextResponse.json(
                { error: 'Missing prompt or language' },
                { status: 400 }
            );
        }

        // 1. Get language ID
        const languageData = await prisma.language.findUnique({
            where: { slug: language_slug },
        });

        if (!languageData) {
            return NextResponse.json(
                { error: 'Invalid language' },
                { status: 400 }
            );
        }

        // 2. Generate code with Gemini
        const aiPrompt = `Write a ${languageData.name} solution for the following task. Return ONLY the code, no markdown formatting, no explanations. Task: ${prompt}`;
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        let code = response.text();

        // Clean up code (remove markdown code blocks if present)
        code = code.replace(/^```[a-z]*\n/i, '').replace(/```$/, '').trim();

        // Get user ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 3. Save to database
        const generationData = await prisma.generation.create({
            data: {
                prompt,
                code,
                language_id: languageData.id,
                user_id: user.id
            },
        });

        return NextResponse.json({
            ...generationData,
            id: generationData.id,
            created_at: generationData.created_at.toISOString(),
            language_id: Number(generationData.language_id)
        }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

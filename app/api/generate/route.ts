import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
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

        // 3. Save to database
        const generationData = await prisma.generation.create({
            data: {
                prompt,
                code,
                language_id: languageData.id,
            },
        });

        return NextResponse.json({
            ...generationData,
            id: generationData.id,
            created_at: generationData.created_at.toISOString(),
            language_id: Number(generationData.language_id) // BigInt handling
        }, {
            status: 200,
            // Handle BigInt serialization
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

// Helper to handle BigInt serialization if needed globally, but for now manual conversion in response
// JSON.stringify doesn't support BigInt by default.
// We can patch it or just convert in the response.
// For this specific response, I converted language_id to Number.

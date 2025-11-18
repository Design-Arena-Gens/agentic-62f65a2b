import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const MODEL = 'gemini-1.5-flash';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode = 'chat', prompt, language = 'hi', direction } = body as {
      mode?: 'chat' | 'translate' | 'search';
      prompt: string;
      language?: 'hi' | 'en';
      direction?: 'en-to-hi' | 'hi-to-en';
    };

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt missing' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL });

    let systemPrompt = '';
    if (mode === 'translate') {
      systemPrompt =
        direction === 'hi-to-en'
          ? 'Translate the driver instruction from Hindi to English. Keep tone polite and crisp.'
          : 'Translate the driver instruction from English to Hindi with simple words suited for Indian truck drivers.';
    } else if (mode === 'search') {
      systemPrompt =
        'Act as a transport operations expert. Summarize the top 3 insights for Indian highway drivers, covering rest stops, tolls, fuel prices, and compliance.';
    } else {
      systemPrompt =
        'You are Driver Helper AI, assisting Indian commercial drivers with compliance, routing, expense logging, and bilingual communication.';
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser input: ${prompt}` }]
        }
      ]
    });

    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('[GeminiRoute]', error);
    return NextResponse.json({ error: 'Gemini request failed' }, { status: 500 });
  }
}

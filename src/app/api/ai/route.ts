import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'Gemini returned an empty response.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text: response.text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    return NextResponse.json(
      {
        error:
          'Unable to generate an AI response. Please try again.',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json(
        { error: 'No transcription provided' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using official Gemini 2.5 Flash model (as per https://ai.google.dev/gemini-api/docs)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp' // Most balanced model with 1M token context
    });

    const prompt = `You are a task extraction AI. Extract individual tasks from the following transcription and return them as a JSON array.

For each task, determine:
1. title: A clear, concise task title (max 60 characters)
2. description: Full details if provided, or leave empty
3. category: One of: "Work", "Personal", "Health", "Errands"
4. dueDate: Extract from phrases like "tomorrow", "today", "next week", "Monday", etc. Return in YYYY-MM-DD format. If no date mentioned, use today's date.
5. impactLevel: Determine based on urgency/importance: "Low", "Medium", or "High"
6. priorityLevel: Assign "P1" (urgent), "P2" (important), or "P3" (normal)

Today's date is: ${new Date().toISOString().split('T')[0]}

Rules:
- Extract ALL tasks mentioned, even if vague
- If multiple tasks in one sentence, split them
- Be smart about dates: "tomorrow" = today + 1 day, "next Monday" = calculate it
- If unsure about category, use "Personal"
- Return ONLY valid JSON, no markdown, no explanation

Transcription:
"${transcription}"

Return format:
[
  {
    "title": "Task title",
    "description": "Details if any",
    "category": "Work",
    "dueDate": "2025-10-26",
    "impactLevel": "Medium",
    "priorityLevel": "P2"
  }
]`;

    console.log('Sending to Gemini AI...');
    
    // Retry logic for API overload
    let retries = 3;
    let lastError: any = null;

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini response:', text);

        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const tasks = JSON.parse(cleanedText);

        if (!Array.isArray(tasks)) {
          throw new Error('Invalid response format from AI');
        }

        return NextResponse.json({ 
          tasks,
          success: true 
        });

      } catch (error: any) {
        lastError = error;
        retries--;
        
        // Check if it's a retryable error (503, 429, overload)
        const errorMessage = error?.message || '';
        const isRetryable = 
          errorMessage.includes('503') || 
          errorMessage.includes('429') || 
          errorMessage.includes('overloaded') ||
          errorMessage.includes('rate limit');

        if (retries > 0 && isRetryable) {
          console.log(`API overloaded, retrying... (${retries} attempts left)`);
          // Exponential backoff: wait longer each retry
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
          continue;
        }
        
        break;
      }
    }

    // If all retries failed
    console.error('Task parsing error after retries:', lastError);
    
    if (lastError instanceof Error) {
      return NextResponse.json(
        { error: lastError.message.includes('overloaded') 
          ? 'AI service is temporarily busy. Please try again in a moment.' 
          : lastError.message 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to parse tasks. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

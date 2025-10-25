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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro' // Using the most capable model
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

  } catch (error) {
    console.error('Task parsing error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to parse tasks' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { MOCK_GRANTS } from '@/lib/mock-data';

// POST /api/grants/[id]/explain - Ask question about grant (AI Explainer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const grantId = parseInt(id, 10);
    const { question, history } = await request.json();

    // Validate input
    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'AI service not configured. Please set GEMINI_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Fetch grant data (using mock data for now)
    const grant = MOCK_GRANTS.find(g => g.id === grantId);
    if (!grant) {
      return NextResponse.json(
        { error: 'Grant not found' },
        { status: 404 }
      );
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    // Build conversation history for Gemini
    // Convert frontend format to Gemini format
    const geminiHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Create system prompt with grant context
    const systemPrompt = `You are an AI grant advisor helping non-profit organizations understand and apply for grants. 

You are currently answering questions about this specific grant:

**Grant Title:** ${grant.title}
**Source:** ${grant.source}
**Description:** ${grant.description}
${grant.funding_min && grant.funding_max ? `**Funding Range:** $${grant.funding_min.toLocaleString()} - $${grant.funding_max.toLocaleString()}` : ''}
${grant.deadline ? `**Deadline:** ${grant.deadline}` : ''}
${grant.duration_months ? `**Duration:** ${grant.duration_months} months` : ''}

Your role is to:
- Answer questions about eligibility criteria, application requirements, and funding scope
- Provide helpful, honest advice about whether this grant fits specific needs
- Explain key aspects of the grant in clear, accessible language
- Be encouraging but realistic about application chances

Always base your answers on the grant information provided above. If you don't know something specific, say so rather than making assumptions.`;

    // Create chat with history and system context
    // Include system prompt as first message if no history exists, otherwise prepend it
    const chatHistory = geminiHistory.length > 0
      ? [
          {
            role: 'user' as const,
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model' as const,
            parts: [{ text: 'I understand. I have the grant details and I\'m ready to help answer your questions.' }],
          },
          ...geminiHistory,
        ]
      : [
          {
            role: 'user' as const,
            parts: [{ text: systemPrompt }],
          },
        ];

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: chatHistory,
    });

    // Send the user's question
    const response = await chat.sendMessage({
      message: question.trim(),
    });

    // Extract the answer text
    const answer = response.text || 'I apologize, but I could not generate a response. Please try again.';

    return NextResponse.json({
      question: question.trim(),
      answer,
      grant_context: {
        id: grant.id,
        title: grant.title,
      },
    });
  } catch (error: any) {
    console.error('Error in grant explainer API:', error);
    
    // Handle Gemini API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GEMINI_API_KEY configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again later.' },
      { status: 500 }
    );
  }
}

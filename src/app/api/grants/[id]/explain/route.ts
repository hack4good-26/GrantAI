import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSupabase } from '@/lib/supabase';

// POST /api/grants/[id]/explain - Ask question about grant (AI Explainer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { question, history } = await request.json();

    console.log(`[Grant Explainer] Starting request for grant ID: ${id}`);
    console.log(`[Grant Explainer] Question: "${question?.substring(0, 100)}${question?.length > 100 ? '...' : ''}"`);
    console.log(`[Grant Explainer] History length: ${history?.length || 0}`);

    // Validate input
    if (!question || !question.trim()) {
      console.warn('[Grant Explainer] Empty question received');
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

    // Fetch grant data from Supabase
    const supabase = getSupabase();
    const { data: grant, error: grantError } = await supabase
      .from('grants_vectors')
      .select('*')
      .eq('id', id)
      .single();

    if (grantError || !grant) {
      console.error(`[Grant Explainer] Grant not found or error fetching: ${id}`, grantError);
      return NextResponse.json(
        { error: 'Grant not found' },
        { status: 404 }
      );
    }

    console.log(`[Grant Explainer] Successfully fetched grant: ${grant.title}`);

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

**Grant Title:** ${grant.title || "Grant Information"}
**Description:** ${grant.description || "No description available"}

${grant.about_grant ? `**About this Grant:** ${grant.about_grant}` : ''}

${grant.who_can_apply ? `**Eligibility:** ${grant.who_can_apply}` : ''}

${grant.when_can_apply ? `**Application Timeline:** ${grant.when_can_apply}` : ''}

${grant.funding_info ? `**Funding Information:** ${grant.funding_info}` : ''}

${grant.how_to_apply ? `**How to Apply:** ${grant.how_to_apply}` : ''}

${grant.application_status ? `**Status:** ${grant.application_status}` : ''}

Your role is to:
- Answer questions about eligibility criteria, application requirements, and funding scope
- Provide helpful, honest advice about whether this grant fits specific needs
- Explain key aspects of the grant in clear, accessible language
- Be encouraging but realistic about application chances

Return your answer with no markdown formatting.
Keep your responses clear, direct and concise.

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

    console.log('[Grant Explainer] Sending message to Gemini...');

    // Send the user's question
    const response = await chat.sendMessage({
      message: question.trim(),
    });

    // Extract the answer text
    const answer = response.text || 'I apologize, but I could not generate a response. Please try again.';
    
    console.log(`[Grant Explainer] Received response from Gemini (${answer.length} chars)`);

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

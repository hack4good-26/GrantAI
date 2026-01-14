// API client for Grant Intent Advisor
// Most data fetching is done directly via Supabase in server components
// This file only contains the explainer API for the AI chatbot

export const explainerApi = {
  explain: async (
    grantId: string,  // UUID string
    question: string,
    history: Array<{ role: string; content: string }>
  ) => {
    // Use fetch for Next.js API routes (same origin)
    const response = await fetch(`/api/grants/${grantId}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to get AI response' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

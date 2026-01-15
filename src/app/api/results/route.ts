import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/embeddings';
import { GoogleGenAI } from '@google/genai';

const K_VALUE = 10;  // Retrieve top 10 from vector search
const TARGET_RECOMMENDATIONS = 6;  // Return 4-6 best matches

export async function POST(request: NextRequest) {
  console.log('=== POST /api/results started ===');
  try {
    const body = await request.json();
    const { description, title, estimated_cost, timeline_months, kpis } = body;
    console.log('Request body:', { description: description?.substring(0, 100), title, estimated_cost, timeline_months, kpis });

    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Step 1: Generate embedding for the query
    console.log('Generating embedding for query:', description);
    const queryEmbedding = await generateEmbedding(description);
    console.log('Embedding generated, length:', queryEmbedding.length);

    // Step 2: Perform vector similarity search using existing match_grants RPC
    console.log(`[STEP 2] Calling match_grants with k=${K_VALUE}...`);
    const { data: vectorResults, error: vectorError } = await supabase.rpc('match_grants', {
      query_embedding: queryEmbedding,
      match_count: K_VALUE
    });

    if (vectorError) {
      console.error('❌ Vector search error:', vectorError);
      throw vectorError;
    }

    if (!vectorResults || vectorResults.length === 0) {
      console.log('❌ No matching grants found');
      return NextResponse.json({ error: 'No matching grants found' }, { status: 404 });
    }

    console.log(`✅ Vector search complete, found ${vectorResults.length} matches`);
    console.log('Raw vector result sample:', JSON.stringify(vectorResults[0], null, 2));

    // Step 2.5: Fetch full grant details for the matched IDs
    const grantIds = vectorResults.map((r: any) => r.id);
    console.log('Fetching full grant details for IDs:', grantIds);

    const { data: fullGrants, error: grantsError } = await supabase
      .from('grants_vectors')
      .select('*')
      .in('id', grantIds);

    if (grantsError || !fullGrants) {
      console.error('❌ Error fetching full grant details:', grantsError);
      throw grantsError;
    }

    // Merge vector search results (with similarity scores) with full grant data
    // Note: match_grants returns 'distance' (lower = better match)
    // Convert distance to similarity: cosine distance is 0-2, so similarity = 1 - (distance / 2)
    const topKGrants = vectorResults.map((vr: any) => {
      const grant = fullGrants.find((g: any) => g.id === vr.id);
      const similarity = Math.max(0, 1 - (vr.distance || 0) / 2); // Convert distance to similarity
      return {
        ...grant,
        similarity,
        distance: vr.distance, // Keep original for debugging
      };
    });

    console.log('Top 3 matches with full data:', topKGrants.slice(0, 3).map((g: any) => ({
      id: g.id,
      title: g.title?.substring(0, 50),
      distance: g.distance?.toFixed(4),
      similarity: (g.similarity * 100).toFixed(1) + '%'
    })));

    // Step 3: LLM Filter Stage - Ask LLM to pick the best 4-6 grants from Top 10
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const grantsList = topKGrants.map((g: any, idx: number) => 
      `${idx + 1}. ${g.title} (Similarity: ${(g.similarity * 100).toFixed(1)}%)\n   ${g.description || ''}`
    ).join('\n\n');

    const filterPrompt = `You are a grant matching expert. Analyze these 10 grants and select the 4-6 BEST matches for this user request:

USER REQUEST:
${description}
${title ? `Title: ${title}` : ''}
${estimated_cost ? `Estimated Cost: $${estimated_cost.toLocaleString()}` : ''}
${timeline_months ? `Timeline: ${timeline_months} months` : ''}
${kpis ? `Key KPIs to track: ${kpis}` : ''}

AVAILABLE GRANTS:
${grantsList}

Select the 4-6 grants that are MOST RELEVANT and BEST MATCHES. Consider:
- Alignment with the user's request goals
- Eligibility requirements
- Funding scope and appropriateness
- Realistic fit

Respond with ONLY a valid JSON array of grant indices (0-based, matching the list above), e.g. [0, 2, 4, 5, 7]
Do not include any other text, explanations, or markdown formatting.`;

    console.log('[STEP 3] Running LLM filter stage...');
    const filterResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: filterPrompt,
    });

    let selectedIndices: number[] = [];
    try {
      const filterText = filterResponse.text?.trim() || '';
      console.log('LLM filter raw response:', filterText);

      if (!filterText) {
        throw new Error('Empty response from LLM filter');
      }
      // Remove markdown code blocks if present
      const jsonText = filterText.replace(/^```json?\n?/i, '').replace(/\n?```$/,'').trim();
      selectedIndices = JSON.parse(jsonText);

      // Validate indices
      if (!Array.isArray(selectedIndices) || selectedIndices.length === 0) {
        throw new Error('Invalid filter response format');
      }

      // Validate indices are within bounds (0 to topKGrants.length - 1)
      selectedIndices = selectedIndices
        .filter((idx: any) => typeof idx === 'number' && idx >= 0 && idx < topKGrants.length)
        .slice(0, TARGET_RECOMMENDATIONS);
      
      if (selectedIndices.length === 0) {
        throw new Error('No valid indices after bounds checking');
      }
      
      console.log(`✅ LLM selected ${selectedIndices.length} grants:`, selectedIndices);
    } catch (error) {
      console.error('❌ Failed to parse filter response, using top matches:', error);
      // Fallback: use top matches by similarity
      selectedIndices = Array.from({ length: Math.min(TARGET_RECOMMENDATIONS, topKGrants.length) }, (_, i) => i);
      console.log('Using fallback indices:', selectedIndices);
    }

    const selectedGrants = selectedIndices.map(idx => topKGrants[idx]).filter(Boolean);
    console.log(`[STEP 4] Selected ${selectedGrants.length} grants for detailed reasoning:`,
      selectedGrants.map((g: any) => ({ id: g.id, title: g.title?.substring(0, 40) })));

    // Step 4: LLM Reasoning Stage - Parallel reasoning for selected 4-6 grants
    const reasoningPromises = selectedGrants.map(async (grant: any) => {
      const reasoningPrompt = `You are a grant matching expert. Analyze if this grant matches the user's request.

USER REQUEST:
${description}
${title ? `Title: ${title}` : ''}
${estimated_cost ? `Estimated Cost: $${estimated_cost.toLocaleString()}` : ''}
${timeline_months ? `Timeline: ${timeline_months} months` : ''}
${kpis ? `Key KPIs to track: ${kpis}` : ''}

GRANT INFORMATION:
Title: ${grant.title}
Description: ${grant.description || 'Not specified'}
About: ${grant.about_grant || 'Not specified'}
Eligibility: ${grant.who_can_apply || 'Not specified'}
Funding: ${grant.funding_info || 'Not specified'}
Application Status: ${grant.application_status || 'Not specified'}

Analyze the match and respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "match_score": <0-100 integer>,
  "why_fits": ["<reason 1>", "<reason 2>", "<reason 3>"],
  "concerns": ["<concern 1>", "<concern 2>"],
  "decision_recommendation": "<APPLY|WATCH|SKIP>",
  "win_probability": <0.0-1.0 float>,
  "match_reasoning": "<3-4 sentence explanation of why this grant does or doesn't match, citing at least two specific details from the user request and grant>"
}`;

      try {
        console.log(`  → Analyzing grant: ${grant.title?.substring(0, 40)}...`);
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: reasoningPrompt,
        });

        const text = response.text?.trim() || '';
        if (!text) {
          throw new Error('Empty response from LLM');
        }
        // Remove markdown code blocks if present
        const jsonText = text.replace(/^```json?\n?/i, '').replace(/\n?```$/,'').trim();
        const reasoning = JSON.parse(jsonText);

        console.log(`  ✅ Analysis complete for ${grant.title?.substring(0, 40)}: score=${reasoning.match_score}, decision=${reasoning.decision_recommendation}`);

        return {
          grant_id: grant.id,
          similarity_score: grant.similarity,
          match_score: reasoning.match_score || Math.round(grant.similarity * 100),
          match_reasoning: reasoning.match_reasoning || 'AI analysis unavailable',
          why_fits: reasoning.why_fits || [],
          concerns: reasoning.concerns || [],
          decision_recommendation: reasoning.decision_recommendation || 'WATCH',
          win_probability: reasoning.win_probability || grant.similarity,
        };
      } catch (error) {
        console.error(`  ❌ LLM reasoning failed for grant ${grant.id}:`, error);
        // Return basic match with similarity score only
        return {
          grant_id: grant.id,
          similarity_score: grant.similarity,
          match_score: Math.round(grant.similarity * 100),
          match_reasoning: 'AI analysis unavailable',
          why_fits: [],
          concerns: [],
          decision_recommendation: 'WATCH' as const,
          win_probability: grant.similarity,
        };
      }
    });

    // Wait for all LLM calls to complete in parallel
    console.log('Running parallel LLM reasoning on selected grants...');
    const allReasonings = await Promise.all(reasoningPromises);
    console.log(`✅ LLM reasoning complete for ${allReasonings.length} grants`);

    // Step 5: Sort by match_score and ensure we have 4-6 results
    console.log('[STEP 5] Sorting by match_score...');
    const finalRecommendations = allReasonings
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, TARGET_RECOMMENDATIONS);

    console.log(`Final recommendations (${finalRecommendations.length}):`,
      finalRecommendations.map(r => ({
        grant_id: r.grant_id,
        match_score: r.match_score,
        decision: r.decision_recommendation
      })));

    // Step 6: Create result record in database
    console.log('[STEP 6] Creating result record in database...');
    const { data: result, error: insertError } = await supabase
      .from('results')
      .insert({
        title: title || description.substring(0, 100),
        description,
        estimated_cost,
        timeline_months,
        recommended_grants: finalRecommendations,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to create result:', insertError);
      throw insertError;
    }

    console.log(`✅ Created result with ID: ${result.id}`);
    console.log('=== POST /api/results completed successfully ===');

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌❌❌ Error in POST /api/results:', error);
    console.error('Error stack:', error.stack);
    console.log('=== POST /api/results failed ===');
    return NextResponse.json(
      { error: error.message || 'Failed to process query' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log('=== DELETE /api/results started ===');
  try {
    const supabase = getSupabase();

    // Delete all results from the results table
    // Using .neq() with an impossible ID to delete all records
    const { error } = await supabase
      .from('results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('❌ Failed to delete results:', error);
      throw error;
    }

    console.log(`✅ Deleted all results from database`);
    console.log('=== DELETE /api/results completed successfully ===');

    return NextResponse.json({ 
      success: true, 
      message: 'All search history cleared' 
    });

  } catch (error: any) {
    console.error('❌❌❌ Error in DELETE /api/results:', error);
    console.error('Error stack:', error.stack);
    console.log('=== DELETE /api/results failed ===');
    return NextResponse.json(
      { error: error.message || 'Failed to clear history' },
      { status: 500 }
    );
  }
}

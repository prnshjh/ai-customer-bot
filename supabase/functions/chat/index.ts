import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      throw new Error("sessionId and message are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Save user message
    await supabase.from("messages").insert({
      session_id: sessionId,
      sender: "user",
      content: message,
    });

    // 2. Check FAQs for exact/similar matches
    const { data: faqs } = await supabase.from("faqs").select("*");
    
    let faqMatch = null;
    if (faqs) {
      for (const faq of faqs) {
        if (
          message.toLowerCase().includes(faq.question.toLowerCase()) ||
          faq.question.toLowerCase().includes(message.toLowerCase())
        ) {
          faqMatch = faq;
          break;
        }
      }
    }

    // 3. If FAQ found, return it immediately
    if (faqMatch) {
      const botResponse = faqMatch.answer;
      await supabase.from("messages").insert({
        session_id: sessionId,
        sender: "bot",
        content: botResponse,
      });

      return new Response(
        JSON.stringify({ response: botResponse, fromFaq: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Get conversation history for context
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(20);

    const conversationHistory = messages?.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    })) || [];

    // 5. Call Gemini via Lovable AI Gateway
    const systemPrompt = `You are a helpful customer support assistant. You provide clear, friendly, and professional responses to customer inquiries. 
If you cannot answer a question or the customer seems frustrated, acknowledge their concern and suggest they may want to speak with a human agent.
Be concise but thorough. Always maintain a helpful and empathetic tone.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI service payment required. Please contact support.");
      }
      throw new Error(`AI service error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const botResponse = aiData.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    // 6. Save bot response
    await supabase.from("messages").insert({
      session_id: sessionId,
      sender: "bot",
      content: botResponse,
    });

    // 7. Check if response suggests escalation
    const needsEscalation = botResponse.toLowerCase().includes("human agent") || 
                           botResponse.toLowerCase().includes("transfer") ||
                           message.toLowerCase().includes("speak to human") ||
                           message.toLowerCase().includes("talk to someone");

    return new Response(
      JSON.stringify({ response: botResponse, needsEscalation, fromFaq: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT_WINDOW_MINUTES = 10;
const MAX_VOTES_PER_WINDOW = 20; // max votes across all proposals per IP per window

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { proposal_id, vote_type, voter_fingerprint, browser_fingerprint } =
      await req.json();

    if (!proposal_id || !vote_type || !voter_fingerprint) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["affirm", "dissent"].includes(vote_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid vote_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for rate limit table access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client IP from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    // --- Rate limit check ---
    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const { count: recentVotes } = await supabaseAdmin
      .from("vote_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("kreated_at", windowStart);

    if ((recentVotes ?? 0) >= MAX_VOTES_PER_WINDOW) {
      return new Response(
        JSON.stringify({
          error: "Rate limited",
          message: "Too many votes recently. Please wait a few minutes.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Composite fingerprint: combine localStorage fp + browser fp ---
    const compositeFingerprint = browser_fingerprint
      ? `${voter_fingerprint}::${browser_fingerprint}`
      : voter_fingerprint;

    // --- Check for existing vote ---
    const { data: existingVote } = await supabaseAdmin
      .from("proposal_votes")
      .select("id, vote_type")
      .eq("proposal_id", proposal_id)
      .eq("voter_fingerprint", compositeFingerprint)
      .maybeSingle();

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Same vote again — no change needed
        return new Response(
          JSON.stringify({
            error: "Already voted",
            message: `You've already ${vote_type === "affirm" ? "affirmed" : "dissented"} on this proposal`,
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // --- Switch vote ---
      const oldColumn = existingVote.vote_type === "affirm" ? "affirms" : "dissents";
      const newColumn = vote_type === "affirm" ? "affirms" : "dissents";

      // Update the vote record
      await supabaseAdmin
        .from("proposal_votes")
        .update({ vote_type })
        .eq("id", existingVote.id);

      // Adjust counts: decrement old, increment new
      const { data: proposal } = await supabaseAdmin
        .from("proposals")
        .select("affirms, dissents")
        .eq("id", proposal_id)
        .single();

      if (proposal) {
        const p = proposal as Record<string, number>;
        await supabaseAdmin
          .from("proposals")
          .update({
            [oldColumn]: Math.max(0, p[oldColumn] - 1),
            [newColumn]: p[newColumn] + 1,
          })
          .eq("id", proposal_id);
      }

      // Record rate limit entry for the switch
      await supabaseAdmin
        .from("vote_rate_limits")
        .insert({ ip_address: ip, proposal_id });

      return new Response(
        JSON.stringify({ success: true, switched: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- New vote: insert ---
    const { error: voteError } = await supabaseAdmin
      .from("proposal_votes")
      .insert({
        proposal_id,
        vote_type,
        voter_fingerprint: compositeFingerprint,
        browser_fingerprint: browser_fingerprint || null,
      });

    if (voteError) throw voteError;

    // --- Record rate limit entry ---
    await supabaseAdmin
      .from("vote_rate_limits")
      .insert({ ip_address: ip, proposal_id });

    // --- Update vote count on proposal ---
    const column = vote_type === "affirm" ? "affirms" : "dissents";
    const { data: proposal } = await supabaseAdmin
      .from("proposals")
      .select(column)
      .eq("id", proposal_id)
      .single();

    if (proposal) {
      await supabaseAdmin
        .from("proposals")
        .update({ [column]: (proposal as Record<string, number>)[column] + 1 })
        .eq("id", proposal_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Vote error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

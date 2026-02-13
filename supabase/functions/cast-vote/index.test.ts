import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/cast-vote`;

// Helper to generate a unique fingerprint per test
function uniqueFingerprint(): string {
  return `test-${crypto.randomUUID()}`;
}

// Helper to create a test proposal directly
async function createTestProposal(): Promise<string> {
  const SUPABASE_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/proposals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      titel: `Test Proposal ${Date.now()}`,
      kontent: "Automated test proposal for voting tests",
      author: "test_runner",
    }),
  });
  const data = await res.json();
  return data[0].id;
}

// Helper to clean up test proposal
async function deleteTestProposal(id: string) {
  const SUPABASE_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
  // Delete votes first
  let res = await fetch(
    `${SUPABASE_URL}/rest/v1/proposal_votes?proposal_id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  await res.text();

  // Delete rate limits
  res = await fetch(
    `${SUPABASE_URL}/rest/v1/vote_rate_limits?proposal_id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  await res.text();

  // Delete proposal
  res = await fetch(`${SUPABASE_URL}/rest/v1/proposals?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  await res.text();
}

async function castVote(
  proposalId: string,
  voteType: "affirm" | "dissent",
  fingerprint: string,
  browserFp?: string
) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proposal_id: proposalId,
      vote_type: voteType,
      voter_fingerprint: fingerprint,
      browser_fingerprint: browserFp || "test-browser-fp",
    }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

// ─── Tests ───

Deno.test("Affirm: new vote succeeds with 200", async () => {
  const proposalId = await createTestProposal();
  try {
    const { status, data } = await castVote(proposalId, "affirm", uniqueFingerprint());
    assertEquals(status, 200);
    assertEquals(data.success, true);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Dissent: new vote succeeds with 200", async () => {
  const proposalId = await createTestProposal();
  try {
    const { status, data } = await castVote(proposalId, "dissent", uniqueFingerprint());
    assertEquals(status, 200);
    assertEquals(data.success, true);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Duplicate vote: same type returns 409", async () => {
  const proposalId = await createTestProposal();
  const fp = uniqueFingerprint();
  try {
    await castVote(proposalId, "affirm", fp);
    const { status, data } = await castVote(proposalId, "affirm", fp);
    assertEquals(status, 409);
    assertExists(data.message);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Vote switch: affirm → dissent returns switched=true", async () => {
  const proposalId = await createTestProposal();
  const fp = uniqueFingerprint();
  try {
    await castVote(proposalId, "affirm", fp);
    const { status, data } = await castVote(proposalId, "dissent", fp);
    assertEquals(status, 200);
    assertEquals(data.switched, true);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Vote switch: dissent → affirm returns switched=true", async () => {
  const proposalId = await createTestProposal();
  const fp = uniqueFingerprint();
  try {
    await castVote(proposalId, "dissent", fp);
    const { status, data } = await castVote(proposalId, "affirm", fp);
    assertEquals(status, 200);
    assertEquals(data.switched, true);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Vote switch then same vote again returns 409", async () => {
  const proposalId = await createTestProposal();
  const fp = uniqueFingerprint();
  try {
    await castVote(proposalId, "affirm", fp);
    await castVote(proposalId, "dissent", fp); // switch
    const { status } = await castVote(proposalId, "dissent", fp); // same again
    assertEquals(status, 409);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Different fingerprints can both vote on same proposal", async () => {
  const proposalId = await createTestProposal();
  try {
    const r1 = await castVote(proposalId, "affirm", uniqueFingerprint());
    const r2 = await castVote(proposalId, "dissent", uniqueFingerprint());
    assertEquals(r1.status, 200);
    assertEquals(r2.status, 200);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Missing fields returns 400", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proposal_id: "fake" }),
  });
  const data = await res.json();
  assertEquals(res.status, 400);
  assertExists(data.error);
});

Deno.test("Invalid vote_type returns 400", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proposal_id: "fake",
      vote_type: "invalid",
      voter_fingerprint: "fp",
    }),
  });
  const data = await res.json();
  assertEquals(res.status, 400);
  assertExists(data.error);
});

Deno.test("CORS: OPTIONS returns 200", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  await res.text();
  assertEquals(res.status, 200);
});

Deno.test("Vote counts update correctly after affirm", async () => {
  const proposalId = await createTestProposal();
  const SUPABASE_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
  try {
    await castVote(proposalId, "affirm", uniqueFingerprint());
    await castVote(proposalId, "affirm", uniqueFingerprint());

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/proposals?id=eq.${proposalId}&select=affirms,dissents`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const data = await res.json();
    assertEquals(data[0].affirms, 2);
    assertEquals(data[0].dissents, 0);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

Deno.test("Vote counts update correctly after switch", async () => {
  const proposalId = await createTestProposal();
  const fp = uniqueFingerprint();
  const SUPABASE_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
  try {
    await castVote(proposalId, "affirm", fp);
    await castVote(proposalId, "dissent", fp); // switch

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/proposals?id=eq.${proposalId}&select=affirms,dissents`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const data = await res.json();
    assertEquals(data[0].affirms, 0);
    assertEquals(data[0].dissents, 1);
  } finally {
    await deleteTestProposal(proposalId);
  }
});

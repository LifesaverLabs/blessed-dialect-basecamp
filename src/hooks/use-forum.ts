import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Proposal {
  id: string;
  titel: string;
  author: string;
  kontent: string;
  affirms: number;
  dissents: number;
  status: string;
  reasoning: string;
  kreated_at: string;
}

export interface Kalment {
  id: string;
  proposal_id: string;
  author: string;
  kontent: string;
  kreated_at: string;
}

function getVoterFingerprint(): string {
  const key = "blessed-voter-fingerprint";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
}

export function useForum() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = useCallback(async () => {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .order("kreated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load proposals");
      console.error(error);
    } else {
      setProposals((data as Proposal[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProposals();

    const channel = supabase
      .channel("proposals-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals" },
        () => fetchProposals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProposals]);

  const submitProposal = async (titel: string, kontent: string) => {
    const { error } = await supabase.from("proposals").insert({
      titel: titel.trim(),
      kontent: kontent.trim(),
      author: "calmunity_member",
    });

    if (error) {
      toast.error("Failed to submit proposal");
      console.error(error);
      return false;
    }
    toast.success("Proposal submitted for calmunity⁵ review");
    return true;
  };

  const vote = async (proposalId: string, voteType: "affirm" | "dissent") => {
    const fingerprint = getVoterFingerprint();
    const column = voteType === "affirm" ? "affirms" : "dissents";

    // Try to insert vote (unique constraint prevents duplicates)
    const { error: voteError } = await supabase
      .from("proposal_votes")
      .insert({ proposal_id: proposalId, vote_type: voteType, voter_fingerprint: fingerprint });

    if (voteError) {
      if (voteError.code === "23505") {
        toast.info("You've already voted on this proposal");
      } else {
        toast.error("Failed to record vote");
        console.error(voteError);
      }
      return;
    }

    // Increment the count on the proposal
    const proposal = proposals.find((p) => p.id === proposalId);
    if (proposal) {
      await supabase
        .from("proposals")
        .update({ [column]: proposal[column] + 1 })
        .eq("id", proposalId);
    }

    toast.success(voteType === "affirm" ? "Affirmed" : "Dissented");
  };

  return { proposals, loading, submitProposal, vote };
}

export function useKalments(proposalId: string | null) {
  const [kalments, setKalments] = useState<Kalment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKalments = useCallback(async () => {
    if (!proposalId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("proposal_kalments")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("kreated_at", { ascending: true });

    if (error) console.error(error);
    else setKalments((data as Kalment[]) || []);
    setLoading(false);
  }, [proposalId]);

  useEffect(() => {
    fetchKalments();

    if (!proposalId) return;
    const channel = supabase
      .channel(`kalments-${proposalId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "proposal_kalments", filter: `proposal_id=eq.${proposalId}` },
        () => fetchKalments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [proposalId, fetchKalments]);

  const addKalment = async (kontent: string) => {
    if (!proposalId) return false;
    const { error } = await supabase
      .from("proposal_kalments")
      .insert({ proposal_id: proposalId, kontent: kontent.trim(), author: "calmunity_member" });

    if (error) {
      toast.error("Failed to post kalment");
      console.error(error);
      return false;
    }
    return true;
  };

  return { kalments, loading, addKalment };
}

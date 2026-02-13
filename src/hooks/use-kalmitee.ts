import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Rekommendation {
  id: string;
  proposal_id: string;
  member_id: string;
  konfidence: number;
  notes: string | null;
  kreated_at: string;
  updated_at: string;
}

export type KonfidenceTier =
  | "Eksploring"
  | "Promising"
  | "Konsensus-forming"
  | "Rekommended"
  | "Adopted";

export function getKonfidenceTier(value: number): KonfidenceTier {
  if (value < 20) return "Eksploring";
  if (value < 40) return "Promising";
  if (value < 60) return "Konsensus-forming";
  if (value < 80) return "Rekommended";
  return "Adopted";
}

export function useKalmiteeRekommendations(proposalId: string) {
  const [rekommendations, setRekommendations] = useState<Rekommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const { data, error } = await supabase
      .from("kalmitee_rekommendations")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("kreated_at", { ascending: false });

    if (error) console.error(error);
    else setRekommendations((data as Rekommendation[]) || []);
    setLoading(false);
  }, [proposalId]);

  useEffect(() => {
    fetch_();

    const channel = supabase
      .channel(`rekommendations-${proposalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kalmitee_rekommendations",
          filter: `proposal_id=eq.${proposalId}`,
        },
        () => fetch_()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [proposalId, fetch_]);

  const averageKonfidence =
    rekommendations.length > 0
      ? Math.round(rekommendations.reduce((s, r) => s + r.konfidence, 0) / rekommendations.length)
      : null;

  const submitRekommendation = async (
    konfidence: number,
    notes: string | null,
    memberId: string
  ) => {
    const { error } = await supabase.from("kalmitee_rekommendations").upsert(
      {
        proposal_id: proposalId,
        member_id: memberId,
        konfidence,
        notes: notes || null,
      },
      { onConflict: "proposal_id,member_id" }
    );

    if (error) {
      toast.error("Failed to submit rekommendation");
      console.error(error);
      return false;
    }
    toast.success("Konfidence reading submitted");
    return true;
  };

  return { rekommendations, loading, averageKonfidence, submitRekommendation };
}

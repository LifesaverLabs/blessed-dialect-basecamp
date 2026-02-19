
-- Fix 1: Remove unrestricted UPDATE on proposals (vote counts managed by edge function only)
DROP POLICY IF EXISTS "Anyone kan update proposals" ON public.proposals;

-- Fix 2: Remove unrestricted UPDATE on proposal_votes (managed by edge function only)
DROP POLICY IF EXISTS "Anyone kan change their vote" ON public.proposal_votes;

-- Fix 3: Add explicit DELETE protection on proposals
CREATE POLICY "No one kan delete proposals"
  ON public.proposals FOR DELETE
  USING (false);

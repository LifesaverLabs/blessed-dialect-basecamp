
-- Rate limiting table for vote safety⁵
CREATE TABLE public.vote_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vote_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct client access — only the edge function (service role) writes here
CREATE POLICY "No direct access to rate limits"
  ON public.vote_rate_limits FOR ALL
  USING (false);

-- Add composite fingerprint column to proposal_votes
ALTER TABLE public.proposal_votes ADD COLUMN browser_fingerprint TEXT;

-- Create index for rate limit lookups
CREATE INDEX idx_vote_rate_limits_ip_proposal ON public.vote_rate_limits(ip_address, proposal_id, kreated_at);


-- Proposals table with Blesséd dialect kolumn names
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titel TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'calmunity_member',
  kontent TEXT NOT NULL,
  affirms INTEGER NOT NULL DEFAULT 0,
  dissents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  reasoning TEXT DEFAULT '',
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone kan read proposals"
  ON public.proposals FOR SELECT
  USING (true);

-- Public insert access (calmunity-driven)
CREATE POLICY "Anyone kan submit proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (true);

-- Public update for vote increments
CREATE POLICY "Anyone kan update proposals"
  ON public.proposals FOR UPDATE
  USING (true);

-- Votes table to track unique votes by fingerprint
CREATE TABLE public.proposal_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('affirm', 'dissent')),
  voter_fingerprint TEXT NOT NULL,
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, voter_fingerprint)
);

ALTER TABLE public.proposal_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone kan read votes"
  ON public.proposal_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone kan vote"
  ON public.proposal_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone kan change their vote"
  ON public.proposal_votes FOR UPDATE
  USING (true);

-- Kalments (comments) table
CREATE TABLE public.proposal_kalments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  author TEXT NOT NULL DEFAULT 'calmunity_member',
  kontent TEXT NOT NULL,
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.proposal_kalments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone kan read kalments"
  ON public.proposal_kalments FOR SELECT
  USING (true);

CREATE POLICY "Anyone kan post kalments"
  ON public.proposal_kalments FOR INSERT
  WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposal_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposal_kalments;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_kolumn()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_kolumn();

-- Seed with initial proposals
INSERT INTO public.proposals (titel, author, kontent, affirms, dissents, status, reasoning) VALUES
  ('Proposal: Replace ''I'' with ''i'' for humility', 'language_explorer', 'Should we lowercase the pronoun ''I'' to ''i'' as a gesture of humility? This could symbolize reducing ego in communication.', 3, 12, 'active', 'Concern: This might be too radical and reduce legibility for other English speakers. Consider: uppercase ''You'' instead?'),
  ('Proposal: Uppercase ''You'' for mutual respect', 'blessed_contributor', 'Capitalize ''You'' to match the respect traditionally given to ''I''—equalizing dignity between speaker and listener in written form.', 45, 7, 'consensus-forming', 'Strong support. Maintains legibility while adding respectful nuance. Aligns with Blesséd dialect goals.'),
  ('Proposal: ''Calmunity⁵'' as standard term for community', 'founding_member', 'Adopt ''calmunity⁵'' (with superscript 5) as the primary term for describing our collaborative groups, emphasizing calm collective power.', 67, 2, 'adopted', 'Consensus reached. Term is now part of official Blesséd dialect with clear definition in dictionary.');

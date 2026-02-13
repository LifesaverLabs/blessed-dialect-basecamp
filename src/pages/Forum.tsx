import { useForum } from "@/hooks/use-forum";
import { ProposalCard } from "@/components/forum/ProposalCard";
import { NewProposalDialog } from "@/components/forum/NewProposalDialog";

const Forum = () => {
  const { proposals, loading, submitProposal, vote } = useForum();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Calmunity⁵ Forum</h1>
            <p className="text-lg text-muted-foreground">
              Propose, diskuss, affirm, and dissent on langauge evolution. Every voice shapes
              Blesséd dialect.
            </p>
          </div>
          <NewProposalDialog onSubmit={submitProposal} />
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading proposals…</p>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onAffirm={(id) => vote(id, "affirm")}
                onDissent={(id) => vote(id, "dissent")}
              />
            ))}
          </div>
        )}

        <div className="bg-secondary/30 p-8 rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-3">Voting Guidelines</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Affirm:</strong> This proposal helps us Borlaug
              more and increases harmlessness
            </li>
            <li>
              <strong className="text-foreground">Dissent:</strong> This proposal doesn't align with
              our goals or may reduce legibility
            </li>
            <li>
              <strong className="text-foreground">Kalment:</strong> Offer konstruktive feedback,
              alternatives, or refinements
            </li>
          </ul>
          <p className="text-sm text-muted-foreground italic mt-4">
            Remember: We're building konsensus toward langauge that serves human flourishing.
            Respektful disagreement strengthens our calmunity⁵.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forum;

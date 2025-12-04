import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Sample forum data - would come from database in production
const sampleProposals = [
  {
    id: 1,
    title: "Proposal: Replace 'I' with 'i' for humility",
    author: "language_explorer",
    content: "Should we lowercase the pronoun 'I' to 'i' as a gesture of humility? This could symbolize reducing ego in communication.",
    affirms: 3,
    dissents: 12,
    comments: 8,
    status: "active",
    reasoning: "Concern: This might be too radical and reduce legibility for other English speakers. Consider: uppercase 'You' instead?",
  },
  {
    id: 2,
    title: "Proposal: Uppercase 'You' for mutual respect",
    author: "blessed_contributor",
    content: "Capitalize 'You' to match the respect traditionally given to 'I'—equalizing dignity between speaker and listener in written form.",
    affirms: 45,
    dissents: 7,
    comments: 23,
    status: "consensus-forming",
    reasoning: "Strong support. Maintains legibility while adding respectful nuance. Aligns with Blesséd dialect goals.",
  },
  {
    id: 3,
    title: "Proposal: 'Calmunity⁵' as standard term for community",
    author: "founding_member",
    content: "Adopt 'calmunity⁵' (with superscript 5) as the primary term for describing our collaborative groups, emphasizing calm collective power.",
    affirms: 67,
    dissents: 2,
    comments: 34,
    status: "adopted",
    reasoning: "Consensus reached. Term is now part of official Blesséd dialect with clear definition in dictionary.",
  },
];

const Forum = () => {
  const [proposals, setProposals] = useState(sampleProposals);
  const [newProposal, setNewProposal] = useState({ title: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAffirm = (proposalId: number) => {
    setProposals(proposals.map(p => 
      p.id === proposalId ? { ...p, affirms: p.affirms + 1 } : p
    ));
    toast.success("Affirmed proposal");
  };

  const handleDissent = (proposalId: number) => {
    setProposals(proposals.map(p => 
      p.id === proposalId ? { ...p, dissents: p.dissents + 1 } : p
    ));
    toast.success("Dissented on proposal");
  };

  const handleSubmitProposal = () => {
    if (!newProposal.title || !newProposal.content) {
      toast.error("Please fill in both title and content");
      return;
    }
    
    toast.success("Proposal submitted for community review");
    setNewProposal({ title: "", content: "" });
    setDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "adopted": return "bg-affirm text-affirm-foreground";
      case "consensus-forming": return "bg-community text-community-foreground";
      case "active": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Calmunity⁵ Forum</h1>
            <p className="text-lg text-muted-foreground">
              Propose, discuss, affirm, and dissent on language evolution. Every voice shapes Blesséd dialect.
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit a New Proposal</DialogTitle>
                <DialogDescription>
                  Propose changes to Blesséd dialect. Focus on language that helps us Borlaug more and increases harmlessness.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief, clear title for your proposal"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Proposal Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe your proposal in detail. Why does this language change help us reach our goals?"
                    rows={6}
                    value={newProposal.content}
                    onChange={(e) => setNewProposal({ ...newProposal, content: e.target.value })}
                  />
                </div>
                <Button onClick={handleSubmitProposal} className="w-full">
                  Submit for Community Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <CardDescription>Proposed by {proposal.author}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground leading-relaxed">{proposal.content}</p>
                
                {proposal.reasoning && (
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground italic">
                      <strong className="text-foreground not-italic">Community reasoning:</strong> {proposal.reasoning}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAffirm(proposal.id)}
                    className="gap-2 hover:bg-affirm/10 hover:text-affirm hover:border-affirm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Affirm ({proposal.affirms})
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDissent(proposal.id)}
                    className="gap-2 hover:bg-dissent/10 hover:text-dissent hover:border-dissent"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Dissent ({proposal.dissents})
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                    <MessageSquare className="w-4 h-4" />
                    {proposal.comments} Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-secondary/30 p-8 rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-3">Voting Guidelines</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Affirm:</strong> This proposal helps us Borlaug more and increases harmlessness</li>
            <li><strong className="text-foreground">Dissent:</strong> This proposal doesn't align with our goals or may reduce legibility</li>
            <li><strong className="text-foreground">Comment:</strong> Offer constructive feedback, alternatives, or refinements</li>
          </ul>
          <p className="text-sm text-muted-foreground italic mt-4">
            Remember: We're building consensus toward language that serves human flourishing. Respectful disagreement strengthens our calmunity⁵.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forum;

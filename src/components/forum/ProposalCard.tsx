import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Proposal } from "@/hooks/use-forum";
import { useKalments } from "@/hooks/use-forum";

interface ProposalCardProps {
  proposal: Proposal;
  onAffirm: (id: string) => void;
  onDissent: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  adopted: "bg-affirm text-affirm-foreground",
  "consensus-forming": "bg-community text-community-foreground",
  active: "bg-accent text-accent-foreground",
};

export function ProposalCard({ proposal, onAffirm, onDissent }: ProposalCardProps) {
  const [kalmentsOpen, setKalmentsOpen] = useState(false);
  const [newKalment, setNewKalment] = useState("");
  const { kalments, loading: kalmentsLoading, addKalment } = useKalments(
    kalmentsOpen ? proposal.id : null
  );

  const handleSubmitKalment = async () => {
    if (!newKalment.trim()) return;
    const ok = await addKalment(newKalment);
    if (ok) setNewKalment("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-2xl">{proposal.titel}</CardTitle>
              <Badge className={statusStyles[proposal.status] || "bg-muted text-muted-foreground"}>
                {proposal.status.replace("-", " ")}
              </Badge>
            </div>
            <CardDescription>Proposed by {proposal.author}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground leading-relaxed">{proposal.kontent}</p>

        {proposal.reasoning && (
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground italic">
              <strong className="text-foreground not-italic">Calmunity⁵ reasoning:</strong>{" "}
              {proposal.reasoning}
            </p>
          </div>
        )}

        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAffirm(proposal.id)}
                  className="gap-2 hover:bg-affirm/10 hover:text-affirm hover:border-affirm"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Affirm ({proposal.affirms})
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[260px] text-center">
                <p className="text-xs">Please chek that your y⁵ for affirming is represented in at least one kalment below.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDissent(proposal.id)}
                  className="gap-2 hover:bg-dissent/10 hover:text-dissent hover:border-dissent"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Dissent ({proposal.dissents})
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[260px] text-center">
                <p className="text-xs">Please chek that your y⁵ for dissenting is represented in at least one kalment below.</p>
              </TooltipContent>
            </Tooltip>

          <Collapsible open={kalmentsOpen} onOpenChange={setKalmentsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <MessageSquare className="w-4 h-4" />
                Kalments
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          </div>
        </TooltipProvider>

        <Collapsible open={kalmentsOpen} onOpenChange={setKalmentsOpen}>
          <CollapsibleContent className="space-y-4 pt-2">
            {kalmentsLoading && (
              <p className="text-sm text-muted-foreground">Loading kalments…</p>
            )}

            {kalments.map((k) => (
              <div key={k.id} className="bg-muted/30 p-3 rounded-lg space-y-1">
                <p className="text-sm font-medium">{k.author}</p>
                <p className="text-sm text-foreground">{k.kontent}</p>
              </div>
            ))}

            {!kalmentsLoading && kalments.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No kalments yet. Be the first!</p>
            )}

            <div className="flex gap-2">
              <Textarea
                placeholder="Share your kalment…"
                rows={2}
                value={newKalment}
                onChange={(e) => setNewKalment(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSubmitKalment} className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

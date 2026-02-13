import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface NewProposalDialogProps {
  onSubmit: (titel: string, kontent: string) => Promise<boolean>;
}

export function NewProposalDialog({ onSubmit }: NewProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [titel, setTitel] = useState("");
  const [kontent, setKontent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!titel.trim() || !kontent.trim()) {
      toast.error("Please fill in both titel and kontent");
      return;
    }
    setSubmitting(true);
    const ok = await onSubmit(titel, kontent);
    setSubmitting(false);
    if (ok) {
      setTitel("");
      setKontent("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Propose changes to Blesséd dialect. Fokus on langauge that helps us Borlaug more and
            increases harmlessness.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="titel">Proposal Titel</Label>
            <Input
              id="titel"
              placeholder="Brief, klear titel for your proposal"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kontent">Proposal Kontent</Label>
            <Textarea
              id="kontent"
              placeholder="Describe your proposal in detail. Why does this langauge change help us reach our goals?"
              rows={6}
              value={kontent}
              onChange={(e) => setKontent(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for Calmunity⁵ Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

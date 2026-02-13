import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getKonfidenceTier } from "@/hooks/use-kalmitee";
import { Shield } from "lucide-react";

interface KalmiteeInputProps {
  onSubmit: (konfidence: number, notes: string | null) => Promise<boolean>;
  existingKonfidence?: number;
  existingNotes?: string | null;
}

export function KalmiteeInput({ onSubmit, existingKonfidence, existingNotes }: KalmiteeInputProps) {
  const [konfidence, setKonfidence] = useState(existingKonfidence ?? 50);
  const [notes, setNotes] = useState(existingNotes ?? "");
  const [submitting, setSubmitting] = useState(false);

  const tier = getKonfidenceTier(konfidence);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(konfidence, notes || null);
    setSubmitting(false);
  };

  return (
    <div className="bg-kalmitee/5 border border-kalmitee/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-kalmitee" />
        <span className="text-sm font-semibold text-kalmitee">
          Your Konfidence Reading
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Konfidence Level</Label>
          <span className="text-sm font-medium">
            {konfidence}% — {tier}
          </span>
        </div>
        <Slider
          value={[konfidence]}
          onValueChange={([v]) => setKonfidence(v)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Notes (optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reasoning for this konfidence level…"
          rows={2}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        size="sm"
        className="bg-kalmitee hover:bg-kalmitee/90 text-kalmitee-foreground"
      >
        {existingKonfidence !== undefined ? "Update Reading" : "Submit Reading"}
      </Button>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { getKonfidenceTier } from "@/hooks/use-kalmitee";

interface KonfidenceScaleProps {
  value: number;
  memberCount: number;
}

const tierColors: Record<string, string> = {
  Eksploring: "bg-muted text-muted-foreground",
  Promising: "bg-community/20 text-community",
  "Konsensus-forming": "bg-accent/20 text-accent-foreground",
  Rekommended: "bg-primary/20 text-primary",
  Adopted: "bg-affirm/20 text-affirm",
};

export function KonfidenceScale({ value, memberCount }: KonfidenceScaleProps) {
  const tier = getKonfidenceTier(value);

  return (
    <div className="bg-kalmitee/5 border border-kalmitee/20 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-kalmitee">
            BDLK Konfidence
          </span>
          <Badge variant="outline" className={tierColors[tier] || ""}>
            {tier}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {memberCount} {memberCount === 1 ? "reading" : "readings"}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className="font-medium text-foreground">{value}%</span>
          <span>100%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-kalmitee rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Eksploring</span>
          <span>Promising</span>
          <span>Konsensus</span>
          <span>Rekommended</span>
          <span>Adopted</span>
        </div>
      </div>
    </div>
  );
}

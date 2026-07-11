import type { CampaignPromise } from "@mandate/shared";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  fulfilled: "default",
  in_progress: "secondary",
  proposed: "outline",
  stalled: "secondary",
  broken: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
  fulfilled: "Fulfilled",
  in_progress: "In Progress",
  proposed: "Proposed",
  stalled: "Stalled",
  broken: "Broken",
};

export function CampaignPromiseList({ promises }: { promises: CampaignPromise[] }) {
  if (promises.length === 0) {
    return <p className="text-sm text-muted-foreground">No campaign promises recorded for this administration yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {promises.map((p) => (
        <li key={p.id} className="rounded-md border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            </div>
            <Badge variant={STATUS_VARIANT[p.status] ?? "outline"} className="shrink-0">
              {STATUS_LABEL[p.status] ?? p.status}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}

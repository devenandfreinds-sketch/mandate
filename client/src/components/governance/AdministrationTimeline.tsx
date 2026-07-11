import type { AdministrationSummary } from "@mandate/shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null): string {
  if (!iso) return "present";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function AdministrationTimeline({
  administrations,
  selectedId,
  onSelect,
}: {
  administrations: AdministrationSummary[];
  selectedId?: string | null;
  onSelect?: (administration: AdministrationSummary) => void;
}) {
  return (
    <ol className="space-y-3">
      {administrations.map((a) => (
        <li key={a.id}>
          <button
            type="button"
            onClick={() => onSelect?.(a)}
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-left transition-colors",
              onSelect && "hover:bg-accent",
              selectedId === a.id && "border-foreground/40 bg-accent"
            )}
          >
            <div>
              <div className="font-medium">
                {a.leaderName}
                {a.termNumber && a.termNumber > 1 ? ` (Term ${a.termNumber})` : ""}
              </div>
              <div className="text-sm text-muted-foreground">
                {a.leaderTitle} · {formatDate(a.startDate)} – {formatDate(a.endDate)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {a.isCurrent && <Badge>Current</Badge>}
              {a.politicalParty && <Badge variant="secondary">{a.politicalParty}</Badge>}
            </div>
          </button>
        </li>
      ))}
    </ol>
  );
}

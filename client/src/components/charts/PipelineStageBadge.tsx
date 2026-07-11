import { PIPELINE_MAX_STAGE } from "@mandate/shared";
import { cn } from "@/lib/utils";

export function PipelineStageBadge({ stage, label }: { stage: number; label: string }) {
  const pct = (stage / PIPELINE_MAX_STAGE) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", stage >= 4 ? "bg-emerald-500" : stage >= 2 ? "bg-amber-500" : "bg-muted-foreground/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {stage}/{PIPELINE_MAX_STAGE} · {label}
      </span>
    </div>
  );
}

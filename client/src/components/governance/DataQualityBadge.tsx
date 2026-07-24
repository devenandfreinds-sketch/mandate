import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  government: "Government",
  academic: "Academic",
  alternative: "Alternative",
  estimated: "Estimated",
  unavailable: "Unavailable",
  // Legacy values, still present on data outside the scope of the 5-status methodology.
  official: "Official Data",
  placeholder: "Placeholder Data",
};

const STYLES: Record<string, string> = {
  government: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  academic: "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  alternative: "border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  estimated: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  unavailable: "border-transparent bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-400",
  // Legacy values, still present on data outside the scope of the 5-status methodology.
  official: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  placeholder: "border-transparent bg-muted text-muted-foreground",
};

export function DataQualityBadge({ dataQuality, className }: { dataQuality: string; className?: string }) {
  const label = LABELS[dataQuality] ?? dataQuality;
  const style = STYLES[dataQuality] ?? STYLES.placeholder;
  return <Badge className={cn(style, className)}>{label}</Badge>;
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  official: "Official Data",
  estimated: "Estimated Data",
  placeholder: "Placeholder Data",
};

const STYLES: Record<string, string> = {
  official: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  estimated: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  placeholder: "border-transparent bg-muted text-muted-foreground",
};

export function DataQualityBadge({ dataQuality, className }: { dataQuality: string; className?: string }) {
  const label = LABELS[dataQuality] ?? dataQuality;
  const style = STYLES[dataQuality] ?? STYLES.placeholder;
  return <Badge className={cn(style, className)}>{label}</Badge>;
}

/** Given a series of values that may mix quality levels, picks the "worst" (least authoritative) for a summary badge. */
export function dominantDataQuality(qualities: string[]): string {
  if (qualities.length === 0) return "placeholder";
  if (qualities.every((q) => q === "official")) return "official";
  if (qualities.some((q) => q === "placeholder")) return "placeholder";
  return "estimated";
}

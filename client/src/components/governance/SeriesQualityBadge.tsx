import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SERIES_QUALITY_LABELS, type SeriesQualityResult, type SeriesQualityCategory } from "@mandate/shared";

/** Either the full per-row result or the coarser counts-only fallback both carry `.category` — that's all this badge needs. */
type QualityLike = { category: SeriesQualityCategory };

const STYLES: Record<SeriesQualityCategory, string> = {
  fully_measured: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  mostly_measured: "border-transparent bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  partially_measured: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  limited_evidence: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  fully_placeholder: "border-transparent bg-muted text-muted-foreground",
  unavailable: "border-transparent bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-400",
};

/**
 * Renders the SERIES-level classification (see shared/src/types/seriesQuality.ts), NOT a single row's
 * dataQuality. Use DataQualityBadge for one MetricValue/PipelineAssessment row; use this for a whole
 * time series so a single leftover placeholder year doesn't visually collapse to the same label as a
 * completely unresearched metric.
 */
export function SeriesQualityBadge({ result, className }: { result: QualityLike; className?: string }) {
  const label = SERIES_QUALITY_LABELS[result.category] ?? result.category;
  const style = STYLES[result.category] ?? STYLES.fully_placeholder;
  return <Badge className={cn(style, className)}>{label}</Badge>;
}

/** A compact one-line breakdown beneath the badge, e.g. "11 periods — 5 real, 1 estimated, 5 placeholder". */
export function SeriesQualityBreakdownText({ result }: { result: SeriesQualityResult }) {
  const { real, estimated, unavailable, placeholder, total } = result.breakdown;
  const parts: string[] = [];
  if (real > 0) parts.push(`${real} real`);
  if (estimated > 0) parts.push(`${estimated} estimated`);
  if (unavailable > 0) parts.push(`${unavailable} unavailable`);
  if (placeholder > 0) parts.push(`${placeholder} placeholder`);

  const showsRecencyCaveat =
    !result.latestPeriodHasEvidence && result.category !== "fully_placeholder" && result.category !== "unavailable";

  return (
    <p className="text-xs text-muted-foreground">
      {total} period{total === 1 ? "" : "s"}
      {parts.length > 0 ? ` — ${parts.join(", ")}` : ""}
      {showsRecencyCaveat ? " · most recent period not yet researched" : ""}
    </p>
  );
}

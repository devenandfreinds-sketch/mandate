import type { CoverageBreakdown } from "@mandate/shared";

/**
 * A three-segment coverage bar: measured (emerald) / unavailable-after-investigation (slate) /
 * unresearched (muted). Deliberately plain — no animation, no gradient, no rounded game-style
 * chunks — this is meant to read like a serious research-institution chart, not a game progress bar.
 */
export function CoverageBar({ coverage, className }: { coverage: CoverageBreakdown; className?: string }) {
  return (
    <div className={className}>
      <div className="flex h-2 w-full overflow-hidden rounded-sm bg-muted">
        <div className="h-full bg-emerald-500" style={{ width: `${coverage.measuredPercent}%` }} title={`Measured: ${coverage.measuredPercent}%`} />
        <div className="h-full bg-slate-400 dark:bg-slate-500" style={{ width: `${coverage.unavailablePercent}%` }} title={`Unavailable: ${coverage.unavailablePercent}%`} />
      </div>
    </div>
  );
}

export function CoverageLegend({ coverage }: { coverage: CoverageBreakdown }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Measured {coverage.measuredPercent}%
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-sm bg-slate-400 dark:bg-slate-500" /> Unavailable {coverage.unavailablePercent}%
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-sm bg-muted" /> Unresearched {coverage.unresearchedPercent}%
      </span>
    </div>
  );
}

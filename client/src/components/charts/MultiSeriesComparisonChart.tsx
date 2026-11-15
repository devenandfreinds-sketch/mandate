import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricSeries, MetricValue } from "@mandate/shared";
import { formatMetricValue } from "@/lib/utils";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

const DAY_MS = 86_400_000;

// Jurisdictions report the same metric on different annual calendars: US cities on calendar years
// ("2015"), UK ones on April-March fiscal years ("FY2015-16") or academic years ("AY2015-16").
// Keying the x-axis on the raw label put every fiscal-year point in its own column after the last
// calendar year, so those series never lined up with the rest. Any roughly-year-long period is
// instead placed at the calendar year containing its midpoint -- the year most of it falls in
// (FY2015-16, Apr 2015-Mar 2016, lands on 2015). Returns null for sub-annual periods.
function axisYear(v: MetricValue): number | null {
  const start = Date.parse(v.periodStart);
  const end = Date.parse(v.periodEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  const days = (end - start) / DAY_MS;
  if (days < 300 || days > 400) return null;
  return new Date((start + end) / 2).getUTCFullYear();
}

export function MultiSeriesComparisonChart({ seriesList, height = 320 }: { seriesList: MetricSeries[]; height?: number }) {
  const allValues = seriesList.flatMap((s) => s.values);
  const years = allValues.map(axisYear);
  // Only share a year axis when every point is annual; quarterly/monthly series keep their own labels.
  const alignByYear = allValues.length > 0 && years.every((y) => y !== null);
  const axisKey = (v: MetricValue) => (alignByYear ? String(axisYear(v)) : v.periodLabel);

  let periodLabels: string[];
  if (alignByYear) {
    const ys = years as number[];
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    // Every year in range gets a column, so a year nobody reported still takes up its space.
    periodLabels = Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
  } else {
    periodLabels = Array.from(new Set(allValues.map((v) => v.periodLabel))).sort();
  }
  // Series whose own periods aren't calendar years -- named in the note below the chart.
  const offCalendarSeries = alignByYear ? seriesList.filter((s) => s.values.some((v) => v.periodLabel !== axisKey(v))) : [];
  const offCalendarExample = offCalendarSeries[0]?.values.find((v) => v.periodLabel !== axisKey(v));
  const unit = seriesList[0]?.metricDefinition.unit ?? "count";

  // A single shared axis can't correctly label two different currencies at once -- rather than
  // silently formatting everything as USD (the old behavior, wrong for any non-USD series), detect
  // the mismatch and fall back to plain numbers on the axis. The tooltip still shows each series'
  // real currency per-line, since that's unambiguous there.
  const currencyCodesByJurisdiction = new Map(seriesList.map((s) => [s.jurisdictionSlug, s.values[0]?.currencyCode ?? "USD"]));
  const distinctCurrencies = new Set(currencyCodesByJurisdiction.values());
  const mixedCurrencies = unit === "currency" && distinctCurrencies.size > 1;

  const data = periodLabels.map((period) => {
    const row: Record<string, string | number | null> = { period };
    for (const s of seriesList) {
      const point = s.values.find((v) => axisKey(v) === period);
      row[s.jurisdictionSlug] = point ? point.value : null;
      row[`${s.jurisdictionSlug}__period`] = point ? point.periodLabel : null;
    }
    return row;
  });

  return (
    <div>
      {mixedCurrencies && (
        <p className="mb-2 text-xs text-muted-foreground">
          Series shown in different currencies ({Array.from(distinctCurrencies).join(", ")}) — see the tooltip for each
          jurisdiction's actual currency; values are not converted or directly comparable.
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="period" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <YAxis
            width={56}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (mixedCurrencies ? Number(v).toLocaleString() : formatMetricValue(Number(v), unit, 0))}
          />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(value: number, _name, entry) => {
              const dataKey = typeof entry?.dataKey === "string" ? entry.dataKey : undefined;
              const currencyCode = (dataKey && currencyCodesByJurisdiction.get(dataKey)) || "USD";
              const formatted = formatMetricValue(value, unit, 1, currencyCode);
              // Show the series' real reporting period when it isn't the calendar year on the axis.
              const row = entry?.payload as Record<string, string | number | null> | undefined;
              const ownPeriod = dataKey && row ? row[`${dataKey}__period`] : null;
              return ownPeriod && ownPeriod !== row?.period ? `${formatted} (${ownPeriod})` : formatted;
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {seriesList.map((s, i) => (
            <Line
              key={s.jurisdictionSlug}
              type="monotone"
              dataKey={s.jurisdictionSlug}
              name={s.jurisdictionName}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {offCalendarSeries.length > 0 && offCalendarExample && (
        <p className="mt-2 text-xs text-muted-foreground">
          {offCalendarSeries.map((s) => s.jurisdictionName).join(", ")} {offCalendarSeries.length === 1 ? "reports" : "report"} on
          fiscal or academic years, plotted at the calendar year most of the period falls in ({offCalendarExample.periodLabel} appears
          at {axisKey(offCalendarExample)}). The tooltip shows each exact period.
        </p>
      )}
    </div>
  );
}

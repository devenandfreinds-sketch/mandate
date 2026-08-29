import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricSeries } from "@mandate/shared";
import { formatMetricValue } from "@/lib/utils";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export function MultiSeriesComparisonChart({ seriesList, height = 320 }: { seriesList: MetricSeries[]; height?: number }) {
  const periodLabels = Array.from(new Set(seriesList.flatMap((s) => s.values.map((v) => v.periodLabel)))).sort();
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
      const point = s.values.find((v) => v.periodLabel === period);
      row[s.jurisdictionSlug] = point ? point.value : null;
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
              return formatMetricValue(value, unit, 1, currencyCode);
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
    </div>
  );
}

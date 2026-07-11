import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricSeries } from "@mandate/shared";
import { formatMetricValue } from "@/lib/utils";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export function MultiSeriesComparisonChart({ seriesList, height = 320 }: { seriesList: MetricSeries[]; height?: number }) {
  const periodLabels = Array.from(new Set(seriesList.flatMap((s) => s.values.map((v) => v.periodLabel)))).sort();
  const unit = seriesList[0]?.metricDefinition.unit ?? "count";

  const data = periodLabels.map((period) => {
    const row: Record<string, string | number | null> = { period };
    for (const s of seriesList) {
      const point = s.values.find((v) => v.periodLabel === period);
      row[s.jurisdictionSlug] = point ? point.value : null;
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="period" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis
          width={56}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatMetricValue(Number(v), unit, 0)}
        />
        <Tooltip
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => formatMetricValue(value, unit, 1)}
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
  );
}

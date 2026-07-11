import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { MetricValue } from "@mandate/shared";

export function MetricSparkline({ values, color = "var(--chart-1)", height = 40 }: { values: MetricValue[]; color?: string; height?: number }) {
  const data = values.map((v) => ({ value: v.value }));
  if (data.length < 2) return <div style={{ height }} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

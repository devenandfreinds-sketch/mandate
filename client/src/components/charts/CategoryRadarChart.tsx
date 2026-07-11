import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export interface RadarDatum {
  category: string;
  value: number;
}

export function CategoryRadarChart({ data, height = 280 }: { data: RadarDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Radar dataKey="value" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

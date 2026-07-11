import type { MetricDefinition } from "./metric.js";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
  colorHex: string | null;
  sortOrder: number;
}

export interface CategoryWithMetricDefinitions extends Category {
  metricDefinitions: MetricDefinition[];
}

import { getJurisdictionMetrics, type JurisdictionMetricsFilter } from "./metric.service.js";

function csvEscape(value: string | number | boolean | null): string {
  if (value === null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function exportJurisdictionMetricsCsv(
  jurisdictionSlug: string,
  filter: JurisdictionMetricsFilter
): Promise<string | null> {
  const series = await getJurisdictionMetrics(jurisdictionSlug, filter);
  if (series === null) return null;

  const header = [
    "category",
    "metric",
    "unit",
    "period",
    "value",
    "confidence",
    "administrationId",
    "isPlaceholder",
  ];
  const rows: string[] = [header.join(",")];

  for (const s of series) {
    for (const v of s.values) {
      rows.push(
        [
          s.metricDefinition.categorySlug,
          s.metricDefinition.slug,
          s.metricDefinition.unit,
          v.periodLabel,
          v.value,
          v.confidence ?? "",
          v.administrationId ?? "",
          v.isPlaceholder,
        ]
          .map(csvEscape)
          .join(",")
      );
    }
  }

  return rows.join("\n");
}

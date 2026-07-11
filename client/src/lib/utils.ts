import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_CHART_VAR: Record<string, string> = {
  housing: "--chart-1",
  innovation: "--chart-2",
  workforce: "--chart-3",
  "government-capacity": "--chart-4",
  transit: "--chart-5",
  "public-safety": "--chart-6",
  "fiscal-health": "--chart-7",
};

export function categoryChartColor(categorySlug: string): string {
  const varName = CATEGORY_CHART_VAR[categorySlug] ?? "--chart-1";
  return `var(${varName})`;
}

export function formatMetricValue(value: number, unit: string, decimalPrecision = 0): string {
  switch (unit) {
    case "usd":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: decimalPrecision,
        notation: Math.abs(value) >= 1_000_000 ? "compact" : "standard",
      }).format(value);
    case "percent":
      return `${value.toFixed(decimalPrecision)}%`;
    case "minutes":
      return `${value.toFixed(decimalPrecision)} min`;
    case "days":
      return `${value.toFixed(decimalPrecision)} days`;
    case "miles":
      return `${value.toFixed(decimalPrecision)} mi`;
    default:
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimalPrecision,
        notation: Math.abs(value) >= 100_000 ? "compact" : "standard",
      }).format(value);
  }
}

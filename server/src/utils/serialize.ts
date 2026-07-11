import type { Decimal } from "@prisma/client/runtime/library";

export function toNumber(value: Decimal | number): number {
  return typeof value === "number" ? value : Number(value);
}

export function toIso(date: Date): string;
export function toIso(date: Date | null): string | null;
export function toIso(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

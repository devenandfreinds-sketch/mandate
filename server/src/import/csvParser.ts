import { parse } from "csv-parse/sync";
import type { RawRow } from "./types.js";

export function parseCsv(buffer: Buffer | string): RawRow[] {
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  return records.map((data, i) => ({ rowNumber: i + 2, data })); // +2: header is row 1, data starts at row 2
}

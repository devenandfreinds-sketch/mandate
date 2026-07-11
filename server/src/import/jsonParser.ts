import type { RawRow } from "./types.js";

export function parseJson(buffer: Buffer | string): RawRow[] {
  const text = typeof buffer === "string" ? buffer : buffer.toString("utf-8");
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("JSON import payload must be an array of row objects");

  return parsed.map((data, i) => {
    if (typeof data !== "object" || data === null) {
      throw new Error(`Row ${i + 1} is not an object`);
    }
    const stringified: Record<string, string> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      stringified[key] = value === null || value === undefined ? "" : String(value);
    }
    return { rowNumber: i + 1, data: stringified };
  });
}

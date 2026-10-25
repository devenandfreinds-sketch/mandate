import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

/**
 * Sets the outreach CRM password (docs/OUTREACH.md) in server/.env. For production, copy the
 * printed OUTREACH_PASSWORD_HASH value into the Railway server service's variables instead.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../../.env");

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: npm run outreach:set-password -w server -- <password of 12+ characters>");
  process.exit(1);
}

function upsertEnvVar(contents: string, key: string, value: string): string {
  const line = `${key}="${value}"`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(contents)) return contents.replace(pattern, line);
  return `${contents.trimEnd()}\n${line}\n`;
}

const hash = bcrypt.hashSync(password, 12);
let contents = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";
contents = upsertEnvVar(contents, "OUTREACH_PASSWORD_HASH", hash);
if (!/^SESSION_SECRET=/m.test(contents)) {
  contents = upsertEnvVar(contents, "SESSION_SECRET", randomBytes(32).toString("hex"));
}
writeFileSync(envPath, contents);
console.log("OUTREACH_PASSWORD_HASH written to server/.env. For production, set this variable on the Railway server service:");
console.log(hash);

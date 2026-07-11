import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../../.env");

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run admin:set-password -- <new-password>");
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
contents = upsertEnvVar(contents, "ADMIN_PASSWORD_HASH", hash);

if (!/^SESSION_SECRET=/m.test(contents)) {
  contents = upsertEnvVar(contents, "SESSION_SECRET", randomBytes(32).toString("hex"));
}

writeFileSync(envPath, contents);
console.log("Admin password hash written to server/.env");

// Fails fast with an actionable message instead of Prisma's cryptic P1012 error
// when required environment variables are missing (most commonly: DATABASE_URL
// wasn't actually set on the Railway service, or a `${{Postgres.DATABASE_URL}}`
// reference didn't resolve because the Postgres service has a different name).
const required = ["DATABASE_URL"];
const recommended = ["SESSION_SECRET", "ADMIN_PASSWORD_HASH"];

const missingRequired = required.filter((key) => !process.env[key]);
const missingRecommended = recommended.filter((key) => !process.env[key]);

if (missingRequired.length > 0) {
  console.error(
    `\n✖ Missing required environment variable(s): ${missingRequired.join(", ")}\n\n` +
      "If you're on Railway: open the server service → Variables, and add DATABASE_URL — " +
      "usually a reference to your Postgres plugin, e.g. ${{Postgres.DATABASE_URL}} (the name " +
      "before the dot must exactly match your Postgres service's name in this project). After " +
      "adding it, redeploy — variable-only changes don't always trigger an automatic redeploy.\n\n" +
      "See docs/RAILWAY_DEPLOYMENT.md for the full setup.\n"
  );
  process.exit(1);
}

if (missingRecommended.length > 0) {
  console.warn(
    `⚠ Missing recommended environment variable(s): ${missingRecommended.join(", ")} — ` +
      "the admin import panel will not work until these are set (see docs/RAILWAY_DEPLOYMENT.md)."
  );
}

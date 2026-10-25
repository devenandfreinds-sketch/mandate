import "dotenv/config";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { prisma } from "../db.js";

/**
 * Imports researched prospects into the outreach CRM (docs/OUTREACH.md).
 *
 * Usage (from server/):
 *   npx tsx src/scripts/importOutreachAccounts.ts <dir of JSON files | file.json> --city "Chicago"
 * Each JSON file (or each element of a JSON array) is one prospect in the research tracker's shape:
 * name, segment, hq, website, strategy, aumLabel, aumSource, fitScore, fitReason, whyMandate,
 * chicagoEvidence|evidence [{fact,url}], sources, caveats, contactEmail*, contactOther, draft {subject, body},
 * status, notes. Upserts by slug (file name or slugified name), so re-running refreshes research fields
 * but NEVER overwrites stage, notes, next steps or deal fields once the team has started working an
 * account. Prospect data is kept out of git; pass its location as an argument.
 */
const args = process.argv.slice(2);
const target = args[0];
const cityIdx = args.indexOf("--city");
const city: string = cityIdx >= 0 ? (args[cityIdx + 1] ?? "") : "";
if (!target || !city) {
  console.error('Usage: npx tsx src/scripts/importOutreachAccounts.ts <dir|file.json> --city "Chicago"');
  process.exit(1);
}

type Raw = Record<string, unknown> & { id?: string; name: string };

function load(p: string): Raw[] {
  if (statSync(p).isDirectory()) {
    return readdirSync(p)
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ id: f.replace(/\.json$/, ""), ...JSON.parse(readFileSync(path.join(p, f), "utf-8")) }));
  }
  const parsed = JSON.parse(readFileSync(p, "utf-8"));
  return (Array.isArray(parsed) ? parsed : [parsed]).map((d) => ("data" in d ? { id: d.id, ...d.data } : d));
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const STATUS_TO_STAGE: Record<string, string> = {
  new: "prospect", drafted: "prospect", contacted: "contacted", replied: "replied", meeting: "meeting", not_fit: "not_fit",
};
const s = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

const TEMPLATES = [
  {
    name: "First touch: investor",
    purpose: "first_touch",
    subject: "Chicago neighborhood data for {{firm}}",
    body: `Hello {{firm}} team,

I'm Deven Mishra, founder of Mandate (mandate.city). We turn scattered city data into one consistent, source-cited dataset: 2015 to 2025 series across housing, public safety, transit, jobs and city finances, with every value linked back to the government source it came from.

{{hook}} For your strategy, the series that seem most useful are {{series}}.

We're opening early access to the Mandate API for a small group of investors. Would a 20-minute call in the next couple of weeks be worthwhile? I'm happy to pull a sample for one of your submarkets beforehand so you can judge it on your own deals.

If this isn't relevant, just reply and I won't follow up.

Best,
Deven Mishra
Founder, Mandate
mandate.city
{{postal address}}`,
  },
  {
    name: "Follow-up (7+ business days)",
    purpose: "follow_up",
    subject: "Re: Chicago neighborhood data for {{firm}}",
    body: `Hello {{firm}} team,

Following up once on my note about Mandate's Chicago data. If it would help, I can send a one-page sample for {{submarket}} covering rent, vacancy and crime trends since 2015, with sources, so you can judge it without a call.

If the timing isn't right, no reply needed and I won't follow up again.

Best,
Deven Mishra
Founder, Mandate
mandate.city
{{postal address}}`,
  },
];

async function main() {
  const rows = load(target);
  let created = 0;
  let refreshed = 0;
  for (const r of rows) {
    const slug = r.id ? slugify(r.id) : slugify(r.name);
    const draft = (r.draft ?? {}) as { subject?: string; body?: string };
    const research = {
      name: r.name,
      city,
      segment: s(r.segment),
      website: s(r.website),
      hq: s(r.hq),
      strategy: s(r.strategy),
      aumLabel: s(r.aumLabel),
      aumSource: s(r.aumSource),
      fitScore: typeof r.fitScore === "number" ? r.fitScore : null,
      fitReason: s(r.fitReason),
      whyMandate: s(r.whyMandate),
      evidence: (r.chicagoEvidence ?? r.evidence ?? []) as object,
      sources: (r.sources ?? []) as object,
      caveats: s(r.caveats),
      contactEmail: s(r.contactEmail),
      contactEmailType: s(r.contactEmailType),
      contactEmailSource: s(r.contactEmailSource),
      // Older tracker records stored the inbox itself as the "contact route"; don't repeat it.
      contactOther: s(r.contactOther) ?? (s(r.contactRoute) && s(r.contactRoute)?.toLowerCase() !== s(r.contactEmail)?.toLowerCase() ? s(r.contactRoute) : null),
    };
    const existing = await prisma.outreachAccount.findUnique({ where: { slug } });
    if (existing) {
      await prisma.outreachAccount.update({ where: { slug }, data: research });
      refreshed++;
    } else {
      await prisma.outreachAccount.create({
        data: {
          ...research,
          slug,
          stage: STATUS_TO_STAGE[String(r.status ?? "new")] ?? "prospect",
          notes: s(r.notes),
          draftSubject: s(draft.subject),
          draftBody: s(draft.body),
          priority: research.fitScore && research.fitScore >= 5 ? "high" : research.fitScore === 4 ? "medium" : "low",
        },
      });
      created++;
    }
  }
  let templates = 0;
  if ((await prisma.outreachTemplate.count()) === 0) {
    for (const t of TEMPLATES) {
      await prisma.outreachTemplate.create({ data: t });
      templates++;
    }
  }
  console.log(`${city}: ${created} created, ${refreshed} refreshed (research fields only). ${templates} starter templates added.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

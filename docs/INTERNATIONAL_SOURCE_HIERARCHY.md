# International Source Hierarchy

**Problem this solves.** The Source Registry already held US federal/state/city agencies, UK national
agencies, a UK combined authority, academic institutions, and named news outlets without any structural
change needed during the Greater Manchester pass — the model itself generalizes well. What it couldn't
record was WHICH country a publisher belongs to or WHAT language it publishes in — every source was
implicitly assumed domestic and English. This document audits the registry against a genuinely
international set of publisher types and fixes that one real gap.

## What the registry already handles correctly (no change needed)

Audited against the full list the task brief asked about — US federal/state agencies, UK national
agencies, combined authorities, municipal governments, academic institutions, think tanks, NGOs,
private data providers, international organizations:

- **`publisher`** (free text) already holds all of these without strain: "U.S. Census Bureau," "UK
  Office for National Statistics," "Greater Manchester Combined Authority," "Institute for Employment
  Studies" (a think tank/research institute), "National Audit Office" — no publisher-type field was
  ever needed because `sourceType` + `publisher` together already carry this information.
- **`sourceType`**'s enforced vocabulary (`government_dataset`, `government_report`, `financial_data`,
  `academic`, `advocacy_report`, `news`, `placeholder`) maps cleanly onto every publisher type
  encountered so far, including a combined authority (`government_report`, same as a US city agency)
  and an independent research institute (`academic`, same as a university).
  International organizations (UN, OECD, World Bank) were not tested this pass but fit the same
  vocabulary — a UN dataset is `government_dataset`-shaped in exactly the sense a national statistics
  office's is, i.e. an official, citable, institutional publication.
- **`methodology`**, **`publicationDate`**, **`updateFrequency`**, **`defaultConfidence`**, **`url`**,
  **`citation`** — all already jurisdiction-neutral free text/date fields, no US assumption found in any
  of them.

## What was missing: country and language

Two new optional fields on `Source`:

```prisma
country  String?  // the PUBLISHER's country, NOT the jurisdiction the data is ABOUT
language String?  // BCP-47-ish code, e.g. "en", "ja", "ko" -- NULL, not assumed "en"
```

Both are explicitly documented as describing the **publisher**, not the subject matter — deliberately,
because these can differ: an OECD or World Bank source covering many countries doesn't have a single
"country," and a US university's academic paper about Tokyo's governance is still a `country: "United
States"` source even though it's *about* Japan. Conflating the two would produce wrong answers to "is
this a domestic or foreign source" for exactly the cross-border research cases internationalization is
meant to support.

Both fields were backfilled for the 16 real UK sources added during the Greater Manchester pass
(`country: "United Kingdom"`, `language: "en"`) — a genuine, low-cost completeness improvement, not
speculative. Every pre-existing US source was left `NULL` rather than backfilled with `"United
States"`/`"en"` — NULL means "not yet recorded," which is honestly true for those rows; inferring and
writing a value Mandate didn't actually verify for each one would overstate precision that doesn't
exist.

## What is deliberately NOT built: a global source-ranking system

The task brief explicitly warned against an arbitrary global ranking system, and the existing 3-tier
hierarchy (government → academic → alternative, `SOURCE_TIERS` in `shared/src/types/pipeline.ts`)
already embodies the right principle without one: **prefer primary official sources when appropriate,
but do not confuse "official" with "correct."**

This principle held up, not just in theory, during the Greater Manchester research:

- GMCA's own "11,000 homes delivered" claim (an official, Tier 1 government source) was NOT taken at
  face value — it's explicitly preserved alongside the independent evaluation's materially different
  ~7,800 figure (reported via investigative journalism, Tier 3) in the GMHILF pipeline assessment, with
  both numbers and their provenance stated rather than one silently chosen as "the" answer.
- The Institute for Employment Studies' independent evaluation (Tier 2, academic) was treated as MORE
  authoritative than GMCA's own framing for whether devolved-AEB outcomes are proven — specifically
  because IES's own findings said outcome data doesn't yet exist, a more rigorous and more conservative
  claim than GMCA's promotional materials would suggest on their own.
- A bus-operator trade body's cost critique (Tier 3, named alternative, with an explicitly disclosed
  institutional bias against public franchising) was still cited and engaged with on its substance,
  not dismissed for being non-government — because Tier 3 sources remain valuable exactly where
  government/academic sources don't exist or don't cover a specific angle (here: contesting the
  official cost narrative).

No new "reliability score" field was added on top of the existing tier system. The tier a piece of
evidence gets is still a per-evidence-item judgment call (`EvidenceLink.sourceTier`), made by whoever
researched it and reviewed by whoever accepts their work — exactly the "human review, not automation"
principle the whole hardening pass is built around.

## Access restrictions

The task brief asked whether source metadata should capture "access restrictions" (e.g. paywalled
sources, restricted government datasets). **Not implemented this pass** — no source encountered in
either Chicago or Greater Manchester research has actually been paywalled or access-restricted; every
real source used so far is openly accessible. Adding a field for a scenario that hasn't occurred yet
would be speculative. If a future jurisdiction's best available source genuinely requires
institutional/paid access, that's the moment to add an `accessRestriction` field with a real case
driving its design — not before.

## Verification

- Migration adds two nullable columns to `Source` — additive, no existing row's `sourceType`,
  `publisher`, or any other field touched.
- All 16 UK sources correctly show `country: "United Kingdom"`, `language: "en"` after reseed; all
  pre-existing US sources correctly remain `NULL` on both fields.
- `isValidSourceType()`/`isVagueSourceName()` validation (unchanged) still runs and passes for the full
  registry on every reseed.

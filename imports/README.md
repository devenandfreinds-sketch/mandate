# Mandate — Data Import Workflow

This directory is the **CSV-first data pipeline** for replacing placeholder metric values with real, officially-sourced observations. It is deliberately manual-download-first: no code in this repository calls out to live government APIs. You download an official dataset, drop it in (or adapt it to) the CSV schema below, and import it — via the CLI or the Admin Import Panel.

## Directory layout

```
/imports
  README.md                     — this file
  templates/<category>.csv      — blank/annotated CSV template per category
  mappings/<category>.mapping.json — column-name mapping config for the importer
  sources/<category>-sources.json  — human-readable manifest of which Source Registry entries back which metrics
  data/<category>/<jurisdiction>.csv — the actual CSVs to import, one per jurisdiction
```

## CSV schema

Every import CSV has the same five columns, regardless of category:

| column       | required | meaning                                                                 |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `jurisdiction` | yes    | Must match an existing `Jurisdiction.slug` (e.g. `new-york-city`, `greater-manchester`) |
| `metric`       | yes    | Must match an existing `MetricDefinition.slug` (e.g. `median_rent`)     |
| `year`         | yes    | 4-digit calendar year (annual periods only in this pass)                |
| `value`        | yes    | Numeric only — no currency symbols, no thousands separators             |
| `confidence`   | no     | `high` \| `estimated` \| `modeled`                                       |
| `notes`        | no     | Free text — cite the exact report/table/page, or explain why a cell is intentionally blank |

Rows with a missing `jurisdiction`, `metric`, `year`, or `value` are **rejected during validation**, not silently skipped — the Admin Import Panel's preview report (and the CLI's `--dry-run` output) lists every rejected row with a reason. This is intentional: several rows in `data/housing/*.csv` are deliberately left with an empty `year`/`value` and a `TODO:` note pointing at the right official source — they document what still needs to be filled in without being importable by accident.

## Housing: current status

The Housing category is the first real dataset. Coverage so far is intentionally partial — this pass prioritized building a correct, repeatable pipeline over exhaustively backfilling every cell:

- **Real, imported**: NYC median rent (2018, NYU Furman Center); Chicago, Washington DC, and Seattle/King County homelessness point-in-time counts (2022–2023, HUD Continuum of Care reports).
- **Documented but not yet pulled**: everything else. Each `TODO:` row in `data/housing/*.csv` names the specific official source to use.
- **No usable public series exists at all** for some US city/metric combinations (e.g., no US city publishes a clean "housing starts" figure the way the UK does) — these are noted as such rather than left looking like an oversight.

See `sources/housing-sources.json` for the full source-to-metric mapping and caveats (methodology changes, county-vs-city scope mismatches, US/UK definitional differences).

## Running an import

### Via the CLI (manual import script)

```bash
npm run admin:set-password -w server -- <your-password>   # one-time setup
npm run import -w server -- \
  --file imports/data/housing/chicago.csv \
  --source "Chicago Point-in-Time Count & Survey Report" \
  --quality official \
  --dry-run                # remove --dry-run to actually commit
```

`--source` accepts either a `Source.id` or a `Source.name` (must already exist — see `server/prisma/seed/data/sources.ts`). Since these CSVs mix metrics that came from different sources within one jurisdiction file, run the import once per source, or split the CSV so each invocation's rows share one source. `--metric` is only needed if the CSV doesn't have a `metric` column (it does, here, so omit it).

### Via the Admin Import Panel

1. Log in at `/admin/login` with the password set via `admin:set-password`.
2. On `/admin/imports`, choose the file, leave "Metric slug" blank (the CSV's `metric` column drives it), enter the Source name, pick a data quality tier, and click **Preview** to see the validation report before anything is written.
3. Click **Commit Import** to write it for real. Every commit is logged as an `ImportJob` with a **Rollback** button that restores the exact prior state (including reverting official data back to whatever placeholder value it replaced).

### Via API ingestion

`POST /api/v1/admin/imports/api` (admin-authenticated) accepts `{ rows: [...], source, quality, category, metric? }` as JSON — this is the path a future scheduled job or external system would use to push data in, without needing a file at all. It runs through the exact same validation and logging as the CSV path.

## Adding a new category's import pipeline

1. Copy `templates/housing.csv` to `templates/<category>.csv` and adjust the example row.
2. Add `mappings/<category>.mapping.json` (usually identical to `housing.mapping.json` — the schema is category-agnostic).
3. Add any new `Source` entries to `server/prisma/seed/data/sources.ts` and re-run `npm run db:seed -w server` (upserts are safe to re-run).
4. Populate `data/<category>/<jurisdiction>.csv` files, real rows first, `TODO:` rows for the rest.

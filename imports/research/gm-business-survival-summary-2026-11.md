# Greater Manchester business_survival_rate: what Mandate holds (November 2026)

**Scope rule for this summary:** only Mandate's registered, tiered sources
(`server/prisma/seed/data/sources.ts`) are used. Nothing from outside the registry is cited.

## Recorded value

| Measure | Value | Birth cohort | Confidence | Source (registry key, tier) |
|---|---|---|---|---|
| 5-year business survival rate, Greater Manchester | **35.37%** | 2019 | high | ONS Business Demography via Explore Local Statistics (`uk_ons`, `government_dataset`, Tier 1) |

- Data file: `imports/data/innovation/greater-manchester-business-survival-2019.csv`
- Write-up: `docs/GREATER_MANCHESTER_CASE_STUDY.md` (business_survival_rate notes)

## Gaps

1. **Single year.** The 2019 cohort is the only one old enough to have reached the five-year mark.
   ONS publishes 1-year rates for the 2020-2023 cohorts and 3-year rates for 2019-2021, but none of
   these are imported into Mandate yet.
2. **No borough breakdown.** Only the Greater Manchester total is held, not the 10 constituent
   boroughs (Bolton, Bury, Manchester, Oldham, Rochdale, Salford, Stockport, Tameside, Trafford, Wigan).
3. **No registered comparator.** No UK, England or North West figure for the 2019 cohort is in the
   registry. Durham's series is a 3-year rate and the US city series come from BLS BED, so neither is
   a like-for-like comparison.

## Next step

Fill gaps 1 and 2 with a fresh pull from `uk_ons` (Explore Local Statistics business survival
indicators, one-, three- and five-year, at lower-tier/unitary authority level). This was not possible
from the November 2026 session because its network policy blocked www.ons.gov.uk.

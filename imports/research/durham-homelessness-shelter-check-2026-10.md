# Durham homelessness_count: Shelter proxy check (October 2026)

**Decision: `unavailable`** (declared in `server/prisma/seed/data/unavailableMetrics.ts`).

Mandate's `homelessness_count` is a single-night point-in-time count of sheltered and unsheltered
individuals (the US HUD concept). No UK local-authority source measures that. The closest proxy is
Shelter's annual "Homelessness in England" local estimates, which an independent verification pass
rejected for these reasons:

1. **Licence.** Shelter's site terms are personal, non-commercial use only, all rights reserved. The
   figures can't be redistributed through Mandate's paid API without written permission.
2. **The December 2023 edition is wrong for every council.** Its local rough-sleeping column is the
   autumn 2019 snapshot, not autumn 2022 as stated. Durham shows 2 (should be 8, total 247 not 241);
   Manchester shows 91 (should be 58). The national total is correct. Oldham is missing from that
   edition entirely.
3. **Not a consistent series.**
   - TA reference dates move from 31 March (2018, 2019) to 30 June (2021 onward).
   - Rough sleeping is always counted on a different night, about 8 months earlier.
   - There is no 2020 local edition.
   - Durham's 2019 figure (293) is mostly an early-recording artefact of the Homelessness Reduction
     Act: 268 of 293 people are "homeless at home" households multiplied by a regional average size.
4. **Concept.** It is a modelled estimate of recorded homelessness. It converts household counts to
   people from administrative snapshots on different dates, and excludes hostels locally.

## Reproduced Durham figures (for reference only; not imported)

| Edition | TA reference | Total | Reproduced from government tables |
|---|---|---|---|
| Nov 2018 | 31 Mar 2018 | 101 | partly |
| Dec 2019 | 31 Mar 2019 | 293 | yes, except TA component (13 vs 15) |
| Dec 2021 | 30 Jun 2021 | 159 | yes |
| Jan 2023 | 30 Jun 2022 | 226 | yes |
| Dec 2023 | 30 Jun 2023 | 241 (should be 247) | no: wrong rough-sleeping year |
| Dec 2024 | 30 Jun 2024 | 306 | yes (TA off by 1) |
| Dec 2025 | 30 Jun 2025 | 349 | yes |

County Durham autumn rough-sleeping snapshot (MHCLG, OGL): 2017: 13, 2018: 12, 2019: 2, 2020: 11,
2021: 11, 2022: 8, 2023: 11, 2024: 18.

## If a proxy is ever wanted

Build it from the openly licensed government tables (MHCLG statutory homelessness TA1/TA2 and the
rough-sleeping snapshot), using a documented method, and label it `estimated` under a separately
defined metric. Never relabel it as a point-in-time count. The same build works for Greater
Manchester by summing the ten boroughs, where Manchester is about 52 to 63% of the total.

# Chicago housing ordinance map (November 2026)

**City:** Chicago
**Pulled:** 2026-11-14 from the City of Chicago Data Portal. **Status:** research files for review. Nothing in the seed data or import CSVs was changed.

This folder maps where Chicago's housing ordinances are being broken, building by building. Each record carries the section of the Municipal Code of Chicago (MCC) behind it. The page has four maps:

1. **Housing code violations.** Buildings with open residential violations, colored by the most serious ordinance area broken.
2. **Vacant buildings.** 311 vacant-building reports, vacant-building violations still marked open, and vacant-building hearing cases.
3. **Public lists and registries.** The Building Code Scofflaw List, the foreclosed rental registry, and short-term rental bans.
4. **All together.** Every layer on one map, with address search and a table by community area.

Maps 1–3 move together when you pan or zoom.

**View it:** open `site/index.html` through a local web server. The page loads its data with `fetch`, so opening the file directly won't work.

```
cd imports/research/chicago-housing-ordinance-map-2026-11/site && python3 -m http.server 8000
# then open http://localhost:8000
```

---

## What's on the maps

| Layer | Records | MCC section(s) | Dataset |
|---|---|---|---|
| Fire safety | 2,631 buildings | 13-196-100 to -160 (smoke detectors), 13-64-190 (CO detectors), 13-160-070, 13-196-080 (exits) | Building Violations `22u3-xenr` |
| Heat, water & utilities | 737 | 13-196-400, -410 (heat), -430 (hot water); Electrical Code 18-27; Plumbing Code 18-29 | `22u3-xenr` |
| Porches, stairs & structure | 4,785 | 13-196-530, -570, -590, -641 | `22u3-xenr` |
| Nuisance & sanitation | 635 | 7-28-060, 7-28-260, 13-196-580, -630, 15-4-970 | `22u3-xenr` |
| Other upkeep | 2,189 | 13-196-550, -560 (windows, doors, screens); 13-12-100 (inspection access); 13-32-010 (permits) | `22u3-xenr` |
| Vacant building reports to 311 | 10,195 | Reports that start vacant-building enforcement under 13-12 | 311 Service Requests `v6vf-nfxy` |
| Older vacant-building violations | 27,924 addresses | 13-12-125, 13-12-140 | `22u3-xenr` |
| Vacant building hearing cases | 4,719 | 13-12-125, 13-12-140 | Vacant and Abandoned Buildings – Violations `kc9i-wq85` |
| Scofflaw List (current / past) | 42 / 659 | 2-92-416 | Building Code Scofflaw List `crg5-4zyp` |
| Foreclosed rental registry | 586 | Keep Chicago Renting Ordinance | Foreclosed Rental Property `yhcw-iu53` |
| Short-term rental banned (building) | 2,398 | 4-13-260(a)(9) | House Share Prohibited Buildings List `7bzs-jsyj` |
| Short-term rental restricted zones | 57 drawn of 192 | Chapter 4-17 | House Share Restricted Residential Zone Precincts `8eww-pamb` |

The five violation layers count each building once, under its most serious category. "Most serious" runs in table order, from fire safety down to other upkeep. The page's neighborhood table counts every building with at least one violation in a category, so its fire and heat numbers are higher.

**Not mappable:**
- **Red X signs.** The Fire Department put red X signs on 1,804 dangerous vacant buildings starting in 2012 and phased the program out in 2014. The city never published the addresses ([WBEZ](https://www.wbez.org/curious-city/2014/10/12/chicago-quietly-phasing-out-red-x-program)).
- **Problem Landlord List** (MCC 2-92-416). It isn't on the data portal. The Scofflaw List names owners and covers much of the same ground.

## Method

- **Violations** are open Department of Buildings violations from the Conservation bureau (residential housing inspections), issued in the two years before the pull. Each one is sorted into an ordinance area by the code section it cites and its description (`scripts/build_viol.py`, `CATS`). About 7% cite no section and are sorted by description alone.
- **"Open"** is the status in the city's file. A violation stays open after repairs until a reinspection happens.
- **Older vacant violations:** the city mostly stopped using vacant-building codes in the Building Violations dataset after 2019. About 28,000 addresses still have one marked open, mostly from 2015–2019. Many are likely stale. Current vacancy is better shown by the 311 reports.
- **Restricted zones:** zones enacted after the 2023 ward remap are drawn on the 2023–24 precinct map (`6piy-vbxa`). The older zones used earlier precinct lines and stay in `restricted.json` only.
- Records are matched to the map by the latitude and longitude the city publishes. Addresses are upper-cased and space-normalised for search and grouping.

## Rebuilding

Requires Python 3 and `shapely` (`pip install shapely`). Network access to `data.cityofchicago.org` and `cdnjs.cloudflare.com`.

```
cd imports/research/chicago-housing-ordinance-map-2026-11
python3 scripts/fetch_layers.py   # Maps 2-3 layers, boundaries, meta  (~1 min)
python3 scripts/build_viol.py     # Map 1 violations by ordinance      (~1 min)
python3 scripts/build_page.py     # site/index.html from page/index.src.html
```

Date windows are computed from the day you run it. The page text still says "since 14 Nov 2024" and "pulled 14 Nov 2026", so update those lines in `page/index.src.html` after a fresh pull. Boundary downloads are cached in `raw/` (git-ignored). Edit the page in `page/index.src.html`, not `site/index.html`, which is generated.

## Files

```
page/index.src.html     page source (Leaflet CSS is inlined at build time)
scripts/common.py       Socrata paging and shared helpers
scripts/fetch_layers.py vacant, list, registry and boundary layers
scripts/build_viol.py   housing code violations grouped by ordinance area
scripts/build_page.py   builds site/index.html
site/                   the built page and its data (about 7.4 MB)
```

# France's Autumn of Discontent (November 2026)

A situation report on France as of 14 November 2026: protests, unemployment, pensions, GDP,
public schools, affordability, dissatisfaction with government and trade unions, followed by
the government's response and an assessment of whether it is a short-term or long-term fix.

- **Report (PDF, 14 pages):** [`Frances-Autumn-of-Discontent-Nov-2026.pdf`](Frances-Autumn-of-Discontent-Nov-2026.pdf)
- **Interactive page:** https://claude.ai/artifact/3LTihbsPTNbeRUaBEmkZxC (private unless shared by its owner)

## Verdict

The response is short-term. Of 17 measures announced since September, 9 are temporary relief
or postponements, 6 are lasting but partial and mostly start in 2027 or later, 1 is a full
structural change going ahead (replacing the Parcoursup admissions platform), and the one
long-run plan, the 2027 budget, was rejected 458 to 0 in the National Assembly on 4 November.
The horizon labels and this verdict are the report's own assessment, not an official
classification.

## Headline figures

| Topic | Figure | Period | Source |
|---|---|---|---|
| GDP | -0.1% on the quarter | Q3 2026 | INSEE |
| Unemployment | 8.2% (+0.4 points in a year); 21.0% for ages 15-24 | Q3 2026 | INSEE |
| Inflation | 3.4% a year (provisional); energy +24.1% | October 2026 | INSEE |
| Public debt | about 119% of GDP | end-June 2026 | INSEE, as reported |
| Public deficit | 5.1% of GDP (2025); 5.4% forecast (2026) | | INSEE, draft budget |
| Trust in the president | 13% | 3-4 Nov 2026 | Elabe |
| Marchers on 5 November | 575,000 (Interior Ministry); 1.57 million (CGT) | | Press reports |
| Pension spending | EUR 436 billion, 14% of GDP | 2027 | Reuters |
| Lower secondary class size | 26 pupils (OECD average 23) | 2024 | OECD |

## Contents

| Path | What it is |
|---|---|
| `data/facts.json` | Every key figure quoted in the report, with period, source and URL |
| `data/*.json` | The 15 other tables behind the charts (unemployment, GDP, inflation, trust, protest turnout, public finances, bond spread, unions, strike rates, class sizes, government measures) |
| `page/` | Source of the interactive page: `index.html`, `charts.js` (d3 v7 drawings) and `geo.js` (simplified region outlines) |
| `scripts/build_datasets.py` | Writes the JSON tables in `data/` from the figures transcribed from the sources |

The page files are written for the Claude dashboard runtime, which supplies `d3` and a `dash`
object. They do not run as a standalone site.

## Caveats

- Figures are as published by 14 November 2026 and do not update. INSEE publishes detailed
  Q3 GDP and November inflation on 27 November 2026.
- Protest turnout is contested; both ministry and organiser counts are kept.
- Some turnout, arrest and damage figures come from the Wikipedia article on the 2026 unrest,
  which cites ministries and news agencies. Treat them as reported, not audited.
- The 2026 debt figure is the end-June level and is approximate.
- Region outlines derive from the `gregoiredavid/france-geojson` project, simplified.

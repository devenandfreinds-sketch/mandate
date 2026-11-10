"""Rebuild every chart in ./charts from the CSVs in ./data.

Reads local files only (no network). Run from anywhere:
    python3 imports/research/six-city-social-brief-2026-11/build_charts.py
Requires matplotlib.
"""
import csv
import os
from collections import defaultdict

import matplotlib
import matplotlib.ticker

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
CHARTS = os.path.join(HERE, "charts")
os.makedirs(CHARTS, exist_ok=True)

# Reference palette (validated: adjacent CVD dE >= 9.1, normal-vision >= 19.6, light surface).
SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK2 = "#52514e"
MUTED = "#8a8985"
GRID = "#e6e5e0"
BLUE, ORANGE, AQUA, YELLOW, MAGENTA = "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"
BENCH = "#8a8985"  # neutral reference line (national benchmark), not a categorical slot
SEQ = ["#0d366b", "#1c5cab", "#2a78d6", "#5598e7", "#86b6ef", "#b7d3f6"]  # dark -> light

# Fixed identity per place, so the same city keeps the same color in every chart.
CITY = {
    "New York City": BLUE,
    "Chicago": ORANGE,
    "Seattle": AQUA,
    "Washington DC": YELLOW,
}

plt.rcParams.update(
    {
        "figure.facecolor": SURFACE,
        "axes.facecolor": SURFACE,
        "savefig.facecolor": SURFACE,
        "font.size": 11,
        "axes.edgecolor": GRID,
        "axes.labelcolor": INK2,
        "xtick.color": INK2,
        "ytick.color": INK2,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.grid": True,
        "grid.color": GRID,
        "grid.linewidth": 0.8,
        "axes.axisbelow": True,
        "text.color": INK,
    }
)


def read(name):
    with open(os.path.join(DATA, name), newline="") as f:
        return list(csv.DictReader(f))


def title(ax, t, sub):
    ax.set_title(t, loc="left", fontsize=14, fontweight="bold", color=INK, pad=26)
    ax.text(0, 1.02, sub, transform=ax.transAxes, fontsize=10, color=INK2, va="bottom")


def source(fig, s, y=-0.01):
    fig.text(0.01, y, "Source: " + s, fontsize=8, color=MUTED, ha="left", va="top")


def dodge(values, gap):
    """Spread end-label y positions so no two are closer than `gap` (keeps order)."""
    order = sorted(range(len(values)), key=lambda i: values[i])
    out = list(values)
    for a, b in zip(order, order[1:]):
        if out[b] - out[a] < gap:
            out[b] = out[a] + gap
    return out


def save(fig, name):
    fig.savefig(os.path.join(CHARTS, name), dpi=150, bbox_inches="tight")
    plt.close(fig)


# 1. Farm income vs government payments -------------------------------------------------
rows = read("farm_income_ers_2019_2026f.csv")
yrs = [r["year"] for r in rows]
nfi = [float(r["net_farm_income_bn"]) for r in rows]
gp = [float(r["direct_government_payments_bn"]) for r in rows]
fig, ax = plt.subplots(figsize=(10, 5.6))
x = list(range(len(yrs)))
ax.axvspan(len(yrs) - 1.5, len(yrs) - 0.5, color="#f1f0ec", zorder=0)
ax.text(len(yrs) - 1, 192, "forecast", ha="center", color=INK2, fontsize=9)
for series, color, label in ((nfi, BLUE, "Net farm income"), (gp, ORANGE, "Direct government payments")):
    ax.plot(x[:-1], series[:-1], color=color, lw=2, marker="o", ms=6, mec=SURFACE, mew=2, label=label)
    ax.plot(x[-2:], series[-2:], color=color, lw=2, ls=(0, (4, 3)))
    ax.plot(x[-1], series[-1], "o", color=color, ms=6, mec=SURFACE, mew=2)
    ax.annotate(f"{label}\n${series[-1]:.1f}B", (x[-1], series[-1]), xytext=(10, 0),
                textcoords="offset points", va="center", fontsize=9.5, color=INK)
for i in (1, len(yrs) - 1):
    ax.annotate(f"{gp[i] / nfi[i] * 100:.0f}% of\nnet income", (x[i], gp[i]), xytext=(0, -34),
                textcoords="offset points", ha="center", fontsize=8.5, color=INK2)
ax.set_xticks(x, yrs)
ax.set_ylim(0, 200)
ax.set_xlim(-0.4, len(yrs) - 0.3)
ax.set_ylabel("Billions of dollars (nominal)")
ax.legend(loc="upper left", frameon=False, fontsize=9.5)
title(ax, "Federal payments are carrying a larger share of farm income",
      "U.S. net farm income vs. direct government payments, 2019–2026 forecast")
source(fig, "USDA Economic Research Service, farm sector financial indicators (Sept 3, 2026 forecast).")
save(fig, "01_farm_income_vs_government_payments.png")

# 2. Farmer Bridge Assistance rates ------------------------------------------------------
rows = read("farmer_bridge_assistance_rates_2026.csv")[::-1]
fig, ax = plt.subplots(figsize=(9, 7.2))
names = [r["commodity"] for r in rows]
vals = [float(r["payment_usd_per_planted_acre"]) for r in rows]
ax.barh(names, vals, color=BLUE, height=0.7, edgecolor=SURFACE, linewidth=2)
for n, v in zip(names, vals):
    ax.text(v + 1.5, n, f"${v:,.2f}", va="center", fontsize=9, color=INK)
ax.grid(axis="y", visible=False)
ax.set_xlabel("U.S. dollars per 2025 planted acre")
ax.set_xlim(0, 150)
title(ax, "Tariff 'bridge' payments vary 16-fold by crop",
      "Farmer Bridge Assistance one-time payment rates, \\$11B row-crop portion of \\$12B package")
source(fig, "USDA press release, Dec 31, 2025 (rates as tabulated by farmdoc daily, Jan 6, 2026).")
save(fig, "02_farmer_bridge_assistance_rates.png")

# 3. Chapter 12 bankruptcies ------------------------------------------------------------
rows = {r["period"]: int(r["chapter12_filings"]) for r in read("farm_bankruptcies_chapter12.csv")}
fig, axes = plt.subplots(1, 2, figsize=(10, 4.6), sharey=True)
for ax, pair, sub in (
    (axes[0], ("2024 full year", "2025 full year"), "Full year"),
    (axes[1], ("2025 Jan-Sep", "2026 Jan-Sep"), "January–September"),
):
    v = [rows[p] for p in pair]
    ax.bar([p[:4] for p in pair], v, color=[SEQ[4], SEQ[1]], width=0.55, edgecolor=SURFACE, linewidth=2)
    for i, val in enumerate(v):
        ax.text(i, val + 6, f"{val}", ha="center", fontsize=11, color=INK, fontweight="bold")
    ax.text(0.5, max(v) + 40, f"+{(v[1] / v[0] - 1) * 100:.0f}%", ha="center", fontsize=12, color=INK)
    ax.set_title(sub, fontsize=11, color=INK2, loc="left")
    ax.grid(axis="x", visible=False)
axes[0].set_ylim(0, 380)
axes[0].set_ylabel("Chapter 12 (family farm) filings")
fig.suptitle("Farm bankruptcies keep rising even as federal aid grows", x=0.01, ha="left", fontsize=14, fontweight="bold")
source(fig, "U.S. Courts bankruptcy statistics, via American Farm Bureau Federation and National Agricultural Law Center.")
fig.tight_layout(rect=(0, 0.04, 1, 0.95))
save(fig, "03_farm_bankruptcies_chapter12.png")

# 4. Overdose death rate trend ---------------------------------------------------------------
rows = read("us_overdose_deaths_rate_2020_2025.csv")
series = defaultdict(list)
for r in rows:
    series[r["place"]].append((int(r["year"]), float(r["rate_per_100k"])))
label_map = {
    "New York City (5 counties)": ("New York City", CITY["New York City"]),
    "Chicago area (Cook County)": ("Chicago (Cook Co.)", CITY["Chicago"]),
    "Seattle area (King County)": ("Seattle (King Co.)", CITY["Seattle"]),
    "Washington DC": ("Washington DC", CITY["Washington DC"]),
    "United States": ("U.S. average", BENCH),
}
fig, ax = plt.subplots(figsize=(10, 5.6))
ends = {p: pts[-1][1] for p, pts in series.items()}
places = list(ends)
ypos = dict(zip(places, dodge([ends[p] for p in places], 2.6)))
for place, pts in series.items():
    lab, col = label_map[place]
    xs, ys = zip(*pts)
    ls = (0, (4, 3)) if place == "United States" else "-"
    ax.plot(xs, ys, color=col, lw=2, ls=ls, marker="o", ms=6, mec=SURFACE, mew=2, label=lab)
    ax.text(xs[-1] + 0.12, ypos[place], f"{lab}  {ys[-1]:.1f}", va="center", fontsize=9.5, color=INK)
ax.set_xticks(range(2020, 2026))
ax.set_xlim(2019.8, 2026.4)
ax.set_ylim(0, 75)
ax.set_ylabel("Drug overdose deaths per 100,000 residents")
ax.legend(loc="upper left", frameon=False, fontsize=9, ncol=3)
title(ax, "Overdose deaths have fallen everywhere since 2023, but DC and Seattle stay high",
      "Drug overdose death rate by county of residence, 12 months ending December")
source(fig, "CDC NCHS provisional county overdose deaths (data as of Oct 4, 2026); Census Vintage 2025 population. Mandate calculation.")
save(fig, "04_overdose_death_rate_trend.png")

# 5. NSDUH substance use disorder ------------------------------------------------------------
rows = read("nsduh_substance_use_disorder_2023_2024.csv")
fig, ax = plt.subplots(figsize=(9.5, 5))
names = [r["state"] for r in rows]
v = [float(r["sud_pct_age12plus"]) for r in rows]
lo = [v[i] - float(r["sud_ci_low"]) for i, r in enumerate(rows)]
hi = [float(r["sud_ci_high"]) - v[i] for i, r in enumerate(rows)]
cols = [CITY["Washington DC"], CITY["Chicago"], CITY["New York City"], CITY["Seattle"], BENCH]
ax.bar(names, v, color=cols, width=0.6, edgecolor=SURFACE, linewidth=2)
ax.errorbar(names, v, yerr=[lo, hi], fmt="none", ecolor=INK2, elinewidth=1.2, capsize=4)
for i, val in enumerate(v):
    ax.text(i, val + hi[i] + 0.6, f"{val:.1f}%", ha="center", fontsize=10.5, color=INK, fontweight="bold")
ax.set_ylim(0, 30)
ax.grid(axis="x", visible=False)
ax.set_ylabel("% of people aged 12+ with a past-year SUD")
title(ax, "About 1 in 6 Americans meets the criteria for a substance use disorder; in DC, nearly 1 in 4",
      "Past-year substance use disorder (alcohol or drugs), 2023–2024 average, with 95% interval")
source(fig, "SAMHSA National Survey on Drug Use and Health, 2023–2024 state estimates (Table 24). State-level: city figures are not published.")
save(fig, "05_substance_use_disorder_prevalence.png")

# 6. US poverty vs overdose scatter ------------------------------------------------------------
rows = read("us_county_poverty_vs_overdose_2025.csv")
fig, ax = plt.subplots(figsize=(9.5, 6))
group = {
    "Bronx": "New York City", "Brooklyn (Kings)": "New York City", "Manhattan (New York Co.)": "New York City",
    "Queens": "New York City", "Staten Island (Richmond)": "New York City", "Cook County (Chicago)": "Chicago",
    "King County (Seattle)": "Seattle", "Washington DC": "Washington DC",
}
offsets = {"Brooklyn (Kings)": (8, -10), "Manhattan (New York Co.)": (4, 12), "Cook County (Chicago)": (4, -14),
           "Staten Island (Richmond)": (-6, 14)}
for r in rows:
    xv, yv = float(r["poverty_rate_pct_2024"]), float(r["overdose_rate_per_100k_2025"])
    ax.scatter(xv, yv, s=110, color=CITY[group[r["county"]]], edgecolor=SURFACE, linewidth=2, zorder=3)
    off = offsets.get(r["county"], (8, 0))
    ax.annotate(r["county"], (xv, yv), xytext=off, textcoords="offset points",
                va="center", ha="right" if off[0] < 0 else "left", fontsize=9, color=INK)
nyc = [r for r in rows if group[r["county"]] == "New York City"]
xs = [float(r["poverty_rate_pct_2024"]) for r in nyc]
ys = [float(r["overdose_rate_per_100k_2025"]) for r in nyc]
n = len(xs)
mx, my = sum(xs) / n, sum(ys) / n
b = sum((a - mx) * (c - my) for a, c in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs)
ax.plot([10.5, 30], [my + b * (10.5 - mx), my + b * (30 - mx)], color=BLUE, lw=1.2, ls=(0, (4, 3)))
ax.text(29.5, my + b * (29.5 - mx) - 6, "NYC boroughs trend\n(r = 0.90)", ha="right", fontsize=9, color=INK2)
ax.set_xlim(7, 32)
ax.set_ylim(0, 50)
ax.set_xlabel("Poverty rate, all ages, 2024 (%)")
ax.set_ylabel("Overdose deaths per 100,000, 2025")
handles = [plt.Line2D([], [], marker="o", ls="", color=c, ms=9, label=k) for k, c in CITY.items()]
ax.legend(handles=handles, loc="upper left", frameon=False, fontsize=9)
title(ax, "Within a city, poorer places have more overdose deaths",
      "Poverty rate vs. overdose death rate, eight counties (all 8 together: r = 0.41)")
source(fig, "Census SAIPE 2024; CDC NCHS provisional county overdose deaths, 2025; Census Vintage 2025. Mandate calculation.")
save(fig, "06_poverty_vs_overdose_us_counties.png")

# 7. Greater Manchester deprivation vs drug misuse deaths --------------------------------------
rows = [r for r in read("greater_manchester_drug_misuse_vs_deprivation.csv") if r["imd2025_average_score"]]
fig, ax = plt.subplots(figsize=(9.5, 6))
for r in rows:
    xv, yv = float(r["imd2025_average_score"]), float(r["drug_misuse_death_rate_per_100k_2023_2025"])
    ax.scatter(xv, yv, s=110, color=MAGENTA, edgecolor=SURFACE, linewidth=2, zorder=3)
    off = {"Bolton": (-8, -2), "Salford": (6, 9), "Rochdale": (-8, -9), "Oldham": (8, -4), "Bury": (6, -11)}.get(r["borough"], (8, 0))
    ax.annotate(r["borough"], (xv, yv), xytext=off, textcoords="offset points", va="center",
                ha="right" if off[0] < 0 else "left", fontsize=9, color=INK)
ax.axhline(6.0, color=BENCH, lw=1.2, ls=(0, (4, 3)))
ax.text(13.2, 6.25, "England average 6.0", fontsize=9, color=INK2)
ax.axhline(7.1, color=BENCH, lw=1.2, ls=":")
ax.text(13.2, 7.35, "North West 7.1", fontsize=9, color=INK2)
ax.set_xlim(12, 44)
ax.set_ylim(0, 13)
ax.set_xlabel("Index of Multiple Deprivation 2025, average score (higher = more deprived)")
ax.set_ylabel("Drug misuse deaths per 100,000 (age-standardised)")
title(ax, "Greater Manchester: the most deprived borough has the most drug deaths",
      "Deprivation vs. drug misuse death rate, 10 boroughs, deaths registered 2023–2025 (r = 0.55)")
source(fig, "ONS drug poisoning deaths by local authority (Nov 4, 2026), Table 6; MHCLG English Indices of Deprivation 2025.")
save(fig, "07_greater_manchester_deprivation_vs_drug_deaths.png")

# 8. Ireland treatment by deprivation band -------------------------------------------------------
rows = read("ireland_treatment_rate_by_deprivation_2024.csv")
fig, ax = plt.subplots(figsize=(10, 5.4))
names = [r["pobal_hp_deprivation_band"].replace(" & ", " &\n").replace("Marginally ", "Marginally\n") for r in rows]
v = [float(r["all_treatment_episodes_per_10k"]) for r in rows]
ax.bar(names, v, color=SEQ, width=0.65, edgecolor=SURFACE, linewidth=2)
for i, val in enumerate(v):
    ax.text(i, val + 2.5, f"{val:.1f}", ha="center", fontsize=11, color=INK, fontweight="bold")
ax.annotate("13× the most\naffluent areas", (0, 148.3), xytext=(1.3, 135), fontsize=10, color=INK,
            arrowprops=dict(arrowstyle="-", color=INK2, lw=1))
ax.set_ylim(0, 170)
ax.grid(axis="x", visible=False)
ax.set_ylabel("Addiction treatment episodes per 10,000 people")
ax.set_xlabel("Neighbourhood deprivation (Pobal HP index), most → least deprived")
title(ax, "Ireland: addiction treatment rises with every step of neighbourhood deprivation",
      "Treatment episodes for all drugs incl. alcohol, by small-area deprivation band, 2024")
source(fig, "Health Research Board & Pobal, Addiction Treatment and Geographic Deprivation (May 2026), Table 4.", y=-0.05)
save(fig, "08_ireland_treatment_by_deprivation.png")

# 9. SNAP participation indexed --------------------------------------------------------------
rows = read("snap_participation_monthly_fy2025_fy2026.csv")
ser = defaultdict(dict)
for r in rows:
    ser[r["state"]][r["month"]] = int(r["snap_persons"])
lab = {
    "New York": ("New York State", CITY["New York City"]),
    "Illinois": ("Illinois", CITY["Chicago"]),
    "Washington": ("Washington State", CITY["Seattle"]),
    "District of Columbia": ("Washington DC", CITY["Washington DC"]),
    "United States": ("U.S. total", BENCH),
}
fig, ax = plt.subplots(figsize=(10.5, 5.8))
months = sorted(ser["United States"])
idx = {k: [ser[k][m] / ser[k]["2024-10"] * 100 for m in months] for k in lab}
keys = list(lab)
ypos = dict(zip(keys, dodge([idx[k][-1] for k in keys], 1.3)))
for st_, (name, col) in lab.items():
    ys = idx[st_]
    ls = (0, (4, 3)) if st_ == "United States" else "-"
    ax.plot(range(len(months)), ys, color=col, lw=2, ls=ls, label=name)
    ax.text(len(months) - 0.6, ypos[st_], f"{name}  {ys[-1] - 100:+.0f}%", va="center", fontsize=9.5, color=INK)
ax.axvline(months.index("2025-11"), color=INK2, lw=1, ls=":")
ax.text(months.index("2025-11") + 0.2, 101.3, "Nov 2025: shutdown benefit lapse;\nexpanded work rules begin rolling out",
        fontsize=8.5, color=INK2, va="top")
tick = [i for i, m in enumerate(months) if m.endswith(("-01", "-07", "-10"))]
ax.set_xticks(tick, [months[i] for i in tick])
ax.set_xlim(-0.5, len(months) + 4.5)
ax.set_ylim(70, 103)
ax.set_ylabel("SNAP participants, Oct 2024 = 100")
ax.legend(loc="lower left", frameon=False, fontsize=9, ncol=3)
title(ax, "SNAP (food stamp) rolls have dropped sharply since late 2025",
      "People receiving SNAP, indexed to October 2024; July 2026 is the latest (initial) month")
source(fig, "USDA Food and Nutrition Service, SNAP National Data Bank (data as of Oct 9, 2026). FY2026 preliminary.")
save(fig, "09_snap_participation_index.png")

# 10. Medicaid change ----------------------------------------------------------------------------
rows = read("medicaid_chip_enrollment_change.csv")
fig, ax = plt.subplots(figsize=(10, 5.2))
names = [r["state"] for r in rows]
a = [float(r["pct_change_since_mar_2023"]) for r in rows]
b_ = [float(r["pct_change_jul2025_to_jul2026"]) for r in rows]
xi = range(len(names))
ax.bar([i - 0.19 for i in xi], a, width=0.36, color=SEQ[1], edgecolor=SURFACE, linewidth=2, label="Since March 2023 (pandemic-era peak)")
ax.bar([i + 0.19 for i in xi], b_, width=0.36, color=SEQ[4], edgecolor=SURFACE, linewidth=2, label="July 2025 → July 2026")
for i in xi:
    ax.text(i - 0.19, a[i] - 1, f"{a[i]:.1f}%", ha="center", va="top", fontsize=9.5, color=INK)
    ax.text(i + 0.19, b_[i] - 1, f"{b_[i]:.1f}%", ha="center", va="top", fontsize=9.5, color=INK)
ax.set_xticks(list(xi), names)
ax.axhline(0, color=INK2, lw=1)
ax.set_ylim(-28, 2)
ax.grid(axis="x", visible=False)
ax.set_ylabel("Change in Medicaid + CHIP enrollment (%)")
ax.legend(loc="lower right", frameon=False, fontsize=9)
title(ax, "Illinois and DC have about one in five fewer Medicaid enrollees than in 2023",
      "Change in total Medicaid and CHIP enrollment, state level (includes people who left for other coverage)")
source(fig, "CMS, data.medicaid.gov, State Medicaid and CHIP Applications, Eligibility Determinations, and Enrollment Data (July 2026 preliminary).")
save(fig, "10_medicaid_enrollment_change.png")

# 11. UK sanctions + Dublin emergency accommodation (two panels) ----------------------------------
uc = read("uk_universal_credit_sanction_rate.csv")
dub = read("dublin_emergency_accommodation.csv")
fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))
ax = axes[0]
uc_recent = [r for r in uc if r["month"] >= "2025-05"]
ax.plot(range(len(uc_recent)), [float(r["pct_of_uc_claimants_in_conditionality_under_sanction"]) for r in uc_recent],
        color=MAGENTA, lw=2, marker="o", ms=6, mec=SURFACE, mew=2)
last = float(uc_recent[-1]["pct_of_uc_claimants_in_conditionality_under_sanction"])
ax.annotate(f"{last:.1f}%", (len(uc_recent) - 1, last), xytext=(8, 0), textcoords="offset points", va="center", fontsize=10)
ax.set_xticks(range(0, len(uc_recent), 3), [uc_recent[i]["month"] for i in range(0, len(uc_recent), 3)])
ax.set_ylim(0, 7)
ax.set_ylabel("% of claimants with work conditions")
ax.set_title("Great Britain: share of Universal Credit claimants\nunder a benefit sanction (GM ≈ 3,400 new sanctions/month)",
             loc="left", fontsize=11, color=INK)
ax = axes[1]
ys = [int(r["individuals_in_emergency_accommodation_dublin_region"]) for r in dub]
ax.plot(range(len(dub)), ys, color=BLUE, lw=2, marker="o", ms=6, mec=SURFACE, mew=2)
ax.annotate(f"{ys[-1]:,}\n({float(dub[-1]['pct_of_dublin_population_census2022']):.2f}% of residents)",
            (len(dub) - 1, ys[-1]), xytext=(-4, 26), textcoords="offset points", ha="right", fontsize=9.5)
ax.yaxis.set_major_formatter(matplotlib.ticker.StrMethodFormatter("{x:,.0f}"))
ax.set_xticks(range(0, len(dub), 3), [dub[i]["month"] for i in range(0, len(dub), 3)])
ax.set_ylim(11000, 12900)
ax.set_ylabel("People in emergency accommodation")
ax.set_title("Dublin: people in homeless emergency accommodation", loc="left", fontsize=11, color=INK)
fig.suptitle("Outside the U.S.: sanctions and homelessness", x=0.01, ha="left", fontsize=14, fontweight="bold")
source(fig, "DWP Benefit sanctions statistics to May 2026 (Tables 2.1, 7.4.3); Dublin Region Homeless Executive monthly report, Aug 2026.")
fig.tight_layout(rect=(0, 0.04, 1, 0.95))
save(fig, "11_uk_sanctions_and_dublin_homelessness.png")

print("charts written to", CHARTS)

"""Rebuild every chart in ./charts from the CSVs in ./data.

Reads local files only (no network). Run from anywhere:
    python3 imports/research/tax-jobs-obbba-brief-2026-11/build_charts.py
Requires matplotlib.
"""
import csv
import os
from collections import defaultdict

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import matplotlib.ticker  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
CHARTS = os.path.join(HERE, "charts")
os.makedirs(CHARTS, exist_ok=True)

# Same validated reference palette as the six-city brief (adjacent CVD dE >= 9.1 on the light surface).
SURFACE, INK, INK2, MUTED, GRID = "#fcfcfb", "#0b0b0b", "#52514e", "#8a8985", "#e6e5e0"
BLUE, ORANGE, AQUA, YELLOW, MAGENTA, GREEN = "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"
BENCH = "#8a8985"
SEQ = ["#0d366b", "#184f95", "#1c5cab", "#2a78d6", "#5598e7", "#86b6ef", "#b7d3f6"]  # dark -> light
NEG, POS = "#e34948", "#2a78d6"  # diverging poles for losses / gains

# Fixed identity per place (same as the six-city brief).
CITY = {
    "New York": BLUE,
    "Chicago": ORANGE,
    "Seattle": AQUA,
    "Washington DC": YELLOW,
    "Greater Manchester": MAGENTA,
    "Dublin": GREEN,
}

plt.rcParams.update(
    {
        "figure.facecolor": SURFACE, "axes.facecolor": SURFACE, "savefig.facecolor": SURFACE,
        "font.size": 11, "axes.edgecolor": GRID, "axes.labelcolor": INK2,
        "xtick.color": INK2, "ytick.color": INK2,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.8, "axes.axisbelow": True,
        "text.color": INK, "text.parse_math": False,
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


def save(fig, name):
    fig.savefig(os.path.join(CHARTS, name), dpi=150, bbox_inches="tight")
    plt.close(fig)


def money(x, _=None):
    return f"-${abs(x):,.0f}" if x < 0 else f"${x:,.0f}"


# ---------------------------------------------------------------------------------------------
# 1. Average federal income tax rate by income group, 2023 (IRS)
irs = read("us_income_tax_rate_by_percentile_irs_2001_2023.csv")
r23 = {r["group"]: float(r["avg_income_tax_rate_pct_of_agi"]) for r in irs if r["tax_year"] == "2023"}
groups = ["Bottom 50%", "50th-90th percentile", "90th-99th percentile", "Top 1%", "Top 0.1%", "Top 0.01%", "Top 0.001%"]
labels = ["Bottom\n50%", "50th–90th\npercentile", "90th–99th\npercentile", "Top 1%", "Top 0.1%", "Top 0.01%", "Top\n0.001%"]
fig, ax = plt.subplots(figsize=(11, 5.8))
vals = [r23[g] for g in groups]
colors = [SEQ[5], SEQ[4], SEQ[3], SEQ[2], SEQ[1], SEQ[1], SEQ[1]]
ax.bar(labels, vals, color=colors, width=0.62, edgecolor=SURFACE, linewidth=2)
for i, v in enumerate(vals):
    ax.text(i, v + 0.6, f"{v:.1f}%", ha="center", fontsize=11, fontweight="bold", color=INK)
# Different measure: CEA wealth-ranked estimate including unrealized gains, shown separately and hatched.
ax.bar(["400 wealthiest\nfamilies*"], [8.2], color=SURFACE, edgecolor=ORANGE, hatch="///", linewidth=1.5, width=0.62)
ax.text(len(labels), 8.8, "8.2%*", ha="center", fontsize=11, fontweight="bold", color=INK)
ax.axvline(len(labels) - 0.5, color=GRID, lw=1.5)
ax.annotate("Rate falls at the very top:\ncapital gains & dividends\nare taxed at lower rates", (6.2, 20), xytext=(4.1, 31),
            fontsize=9, color=INK2, arrowprops=dict(arrowstyle="-", color=INK2, lw=1))
ax.set_ylim(0, 35)
ax.grid(axis="x", visible=False)
ax.set_ylabel("Federal income tax as % of adjusted gross income")
title(ax, "The top 1% pay 7× the bottom half's income tax rate, but it dips at the very top",
      "U.S. average federal individual income tax rate by income group, tax year 2023")
source(fig, "IRS Statistics of Income, Table 4.1 (tax years 2001–2023); middle groups derived from IRS shares (Mandate calculation).\n"
       "*Different measure: White House CEA/OMB (2021), 400 wealthiest families 2010–2018, counting unrealized capital gains as income.")
save(fig, "01_us_income_tax_rate_by_group_2023.png")

# 2. Trend: tax rates and tax shares 2001-2023
by = defaultdict(dict)
for r in irs:
    by[r["group"]][int(r["tax_year"])] = float(r["avg_income_tax_rate_pct_of_agi"])
fig, ax = plt.subplots(figsize=(10.5, 5.6))
spec = [("Top 1%", SEQ[1], "Top 1%"), ("90th-99th percentile", SEQ[3], "90th–99th"),
        ("50th-90th percentile", SEQ[4], "50th–90th (middle class)"), ("Bottom 50%", SEQ[5], "Bottom 50%")]
for g, c, lab in spec:
    ys = sorted(by[g].items())
    ax.plot([y for y, _ in ys], [v for _, v in ys], color=c, lw=2, label=lab)
    ax.text(2023.3, ys[-1][1], f"{lab}  {ys[-1][1]:.1f}%", va="center", fontsize=9.5, color=INK)
ax.axvspan(2017.5, 2018.5, color="#f1f0ec", zorder=0)
ax.text(2018.6, 29.2, "2018: 2017 tax law\n(TCJA) takes effect", ha="left", fontsize=8.5, color=INK2)
ax.annotate("2013: top rate back to 39.6%\n+ 3.8% investment income tax", (2013, 27.1), xytext=(2008.3, 29.2), fontsize=8.5, color=INK2,
            arrowprops=dict(arrowstyle="-", color=INK2, lw=1))
ax.set_xlim(2000.5, 2029)
ax.set_ylim(0, 32)
ax.set_ylabel("Income tax as % of AGI")
ax.legend(loc="lower left", bbox_to_anchor=(0, 0.52), frameon=False, fontsize=9, ncol=2)
title(ax, "Income tax rates have edged down for most groups since 2001",
      "U.S. average federal individual income tax rate by income group, tax years 2001–2023")
source(fig, "IRS Statistics of Income, Table 4.1; group rates for non-top groups derived from IRS AGI and tax shares (Mandate calculation).")
save(fig, "02_us_income_tax_rate_trend_2001_2023.png")

# 3. Share of income vs share of income tax, 2023
shares = {r["group"]: (float(r["share_of_agi_pct"]), float(r["share_of_income_tax_pct"])) for r in irs if r["tax_year"] == "2023"}
g3 = ["Bottom 50%", "50th-90th percentile", "90th-99th percentile", "Top 1%"]
l3 = ["Bottom 50%", "50th–90th", "90th–99th", "Top 1%"]
fig, ax = plt.subplots(figsize=(10, 5.2))
xi = range(len(g3))
a = [shares[g][0] for g in g3]
t = [shares[g][1] for g in g3]
ax.bar([i - 0.19 for i in xi], a, width=0.36, color=SEQ[5], edgecolor=SURFACE, linewidth=2, label="Share of all income (AGI)")
ax.bar([i + 0.19 for i in xi], t, width=0.36, color=SEQ[1], edgecolor=SURFACE, linewidth=2, label="Share of all federal income tax paid")
for i in xi:
    ax.text(i - 0.19, a[i] + 0.8, f"{a[i]:.1f}%", ha="center", fontsize=9.5, color=INK)
    ax.text(i + 0.19, t[i] + 0.8, f"{t[i]:.1f}%", ha="center", fontsize=9.5, color=INK)
ax.set_xticks(list(xi), l3)
ax.set_ylim(0, 48)
ax.grid(axis="x", visible=False)
ax.set_ylabel("% of U.S. total")
ax.legend(loc="upper left", frameon=False, fontsize=9.5)
title(ax, "The top 1% earn about a fifth of income and pay over a third of income tax",
      "Share of adjusted gross income vs. share of federal income tax, tax year 2023")
source(fig, "IRS Statistics of Income, Table 4.1 (Mandate calculation for non-cumulative groups). Income tax only: payroll, state and sales taxes not included.")
save(fig, "03_us_income_share_vs_tax_share_2023.png")

# 4. UK: all taxes as % of gross income by quintile (stacked direct + indirect)
uk = read("uk_taxes_pct_gross_income_by_quintile_2023_24.csv")[:5]
fig, ax = plt.subplots(figsize=(10, 5.4))
names = ["Poorest\nfifth", "2nd", "Middle\nfifth", "4th", "Richest\nfifth"]
d = [float(r["direct_taxes_pct"]) for r in uk]
ind = [float(r["indirect_taxes_pct"]) for r in uk]
tot = [float(r["all_taxes_pct"]) for r in uk]
ax.bar(names, d, color=SEQ[2], width=0.6, edgecolor=SURFACE, linewidth=2, label="Direct taxes (income tax, National Insurance, council tax)")
ax.bar(names, ind, bottom=d, color=SEQ[5], width=0.6, edgecolor=SURFACE, linewidth=2, label="Indirect taxes (VAT, duties)")
for i in range(5):
    ax.text(i, tot[i] + 0.8, f"{tot[i]:.1f}%", ha="center", fontsize=11, fontweight="bold", color=INK)
    ax.text(i, d[i] / 2, f"{d[i]:.1f}", ha="center", va="center", fontsize=9, color=SURFACE)
    ax.text(i, d[i] + ind[i] / 2, f"{ind[i]:.1f}", ha="center", va="center", fontsize=9, color=INK)
ax.set_ylim(0, 45)
ax.grid(axis="x", visible=False)
ax.set_ylabel("% of gross household income")
ax.legend(loc="upper center", frameon=False, fontsize=9, ncol=2)
title(ax, "UK: the poorest fifth pay as large a share of income in tax as the richest",
      "All taxes as % of gross income, by household income fifth, UK 2023/24")
source(fig, "ONS, Effects of taxes and benefits on household income, FYE 2024, Table 8. Bottom-fifth direct tax includes some deferred lump-sum payments (ONS note 6).")
save(fig, "04_uk_taxes_by_income_fifth.png")

# 5. Unemployment rate, six cities vs national, 2005-2025 (small multiples)
us = read("us_unemployment_rate_2005_2025.csv")
usd = defaultdict(dict)
for r in us:
    if r["year"].isdigit():
        usd[r["area"]][int(r["year"])] = float(r["unemployment_rate_pct"])
gm = read("greater_manchester_employment_2005_2026.csv")
gmd = defaultdict(dict)
for r in gm:
    if r["period"].isdigit() and r["measure"].startswith("Unemployment"):
        gmd[r["area"]][int(r["period"])] = float(r["value_pct"])
du = read("dublin_unemployment_2005_2026.csv")
dud = defaultdict(dict)
for r in du:
    if r["year"].isdigit():
        dud[r["area"]][int(r["year"])] = float(r["unemployment_rate_pct"])
panels = [
    ("New York", usd["New York metro"], usd["United States"], "New York metro", "U.S."),
    ("Chicago", usd["Chicago metro"], usd["United States"], "Chicago metro", "U.S."),
    ("Seattle", usd["Seattle metro"], usd["United States"], "Seattle metro", "U.S."),
    ("Washington DC", usd["District of Columbia (city)"], usd["United States"], "DC (city)", "U.S."),
    ("Greater Manchester", gmd["Greater Manchester (Met County)"], gmd["England"], "Greater Manchester", "England"),
    ("Dublin", dud["Dublin"], dud["State"], "Dublin region", "Ireland"),
]
fig, axes = plt.subplots(2, 3, figsize=(13, 7.4), sharey=True)
for ax, (city, s, nat, lab, natlab) in zip(axes.flat, panels):
    xs = sorted(s)
    ax.plot(sorted(nat), [nat[y] for y in sorted(nat)], color=BENCH, lw=1.6, ls=(0, (4, 3)))
    ax.plot(xs, [s[y] for y in xs], color=CITY[city], lw=2.2)
    pk = max(s, key=s.get)
    ax.annotate(f"peak {s[pk]:.1f}% ({pk})", (pk, s[pk]), xytext=(0, 9), textcoords="offset points", ha="center", fontsize=8.5, color=INK2,
                bbox=dict(boxstyle="round,pad=0.15", fc=SURFACE, ec="none"))
    ax.annotate(f"{s[xs[-1]]:.1f}%", (xs[-1], s[xs[-1]]), xytext=(4, 0), textcoords="offset points", va="center", fontsize=9, color=INK)
    ax.set_title(f"{lab}  vs  {natlab} (dashed)", loc="left", fontsize=10.5, color=INK)
    ax.set_xlim(2004, 2027.5)
    ax.set_ylim(0, 17)
    ax.set_xticks([2005, 2010, 2015, 2020, 2025])
for ax in axes[:, 0]:
    ax.set_ylabel("Unemployment rate (%)")
fig.suptitle("Unemployment over 20 years: two shocks (2009–12 and 2020), a long recovery, and a 2025 rise in DC",
             x=0.01, ha="left", fontsize=14, fontweight="bold")
source(fig, "U.S.: BLS LAUS/CPS via FRED (2025 excludes Oct, not collected in shutdown). Greater Manchester: ONS Annual Population Survey (Nomis).\n"
       "Dublin: CSO Labour Force Survey QNQ22 to 2011, QLF08 from 2012 (series break; Mandate calculation from counts). Rates are not strictly comparable across countries.")
fig.tight_layout(rect=(0, 0.03, 1, 0.95))
save(fig, "05_unemployment_six_cities_2005_2025.png")

# 6. Jobs indexed to 2005 (US metros) and employment in Dublin
jb = read("us_metro_nonfarm_jobs_2005_2025.csv")
jd = defaultdict(dict)
for r in jb:
    if r["year"].isdigit():
        jd[r["area"]][int(r["year"])] = float(r["nonfarm_jobs_thousands"])
emp = defaultdict(dict)
for r in du:
    if r["year"].isdigit():
        emp[r["area"]][int(r["year"])] = float(r["employed_thousands"])
fig, ax = plt.subplots(figsize=(10.5, 5.8))
series = [("Seattle metro", CITY["Seattle"]), ("New York metro", CITY["New York"]),
          ("Washington DC metro", CITY["Washington DC"]), ("Chicago metro", CITY["Chicago"])]
ends = []
for name, col in series:
    s = jd[name]
    ys = [s[y] / s[2005] * 100 for y in sorted(s)]
    ax.plot(sorted(s), ys, color=col, lw=2, label=f"{name} (payroll jobs)")
    ends.append((ys[-1], f"{name}  {ys[-1] - 100:+.0f}%"))
s = emp["Dublin"]
ys = [s[y] / s[2005] * 100 for y in sorted(s)]
ax.plot(sorted(s), ys, color=CITY["Dublin"], lw=2, ls=(0, (4, 2)), label="Dublin region (people employed)")
ends.append((ys[-1], f"Dublin  {ys[-1] - 100:+.0f}%"))
ends.sort()
prev = -1e9
for y, txt in ends:
    y = max(y, prev + 3.2)
    ax.text(2025.4, y, txt, va="center", fontsize=9.5, color=INK)
    prev = y
ax.axhline(100, color=INK2, lw=1)
ax.set_xticks([2005, 2010, 2015, 2020, 2025])
ax.set_xlim(2004.5, 2031)
ax.set_ylabel("Index, 2005 = 100")
ax.legend(loc="upper left", frameon=False, fontsize=9)
title(ax, "Since 2005, Dublin and Seattle added jobs fastest; Chicago barely grew",
      "Employment indexed to 2005 (U.S. metros: payroll jobs; Dublin: residents in work)")
source(fig, "BLS Current Employment Statistics via FRED (annual averages); CSO Labour Force Survey QNQ22/QLF08 (series break 2012). Greater Manchester omitted: no comparable count series.")
save(fig, "06_jobs_growth_since_2005.png")

# 7. Greater Manchester employment rate vs England
gme = defaultdict(dict)
for r in gm:
    if r["period"].isdigit() and r["measure"].startswith("Employment"):
        gme[r["area"]][int(r["period"])] = float(r["value_pct"])
fig, ax = plt.subplots(figsize=(10, 5))
for area, col, lab, ls in (("England", BENCH, "England", (0, (4, 3))), ("Greater Manchester (Met County)", CITY["Greater Manchester"], "Greater Manchester", "-")):
    s = gme[area]
    ax.plot(sorted(s), [s[y] for y in sorted(s)], color=col, lw=2.2, ls=ls, label=lab)
    ax.text(2025.3, s[2025], f"{lab}  {s[2025]:.1f}%", va="center", fontsize=9.5, color=INK)
gap = [gme["England"][y] - gme["Greater Manchester (Met County)"][y] for y in sorted(gme["England"])]
ax.text(2006, 76.5, f"Gap has stayed between about 3 and 5 points for 20 years (2025: {gap[-1]:.1f})", fontsize=9.5, color=INK2)
ax.set_xlim(2004.5, 2029.5)
ax.set_ylim(64, 78)
ax.set_ylabel("Employment rate, aged 16–64 (%)")
ax.legend(loc="lower right", frameon=False, fontsize=9.5)
title(ax, "Greater Manchester's employment rate has never closed the gap with England",
      "Share of people aged 16–64 in work, calendar years 2005–2025")
source(fig, "ONS Annual Population Survey via Nomis (dataset NM_17_5).")
save(fig, "07_greater_manchester_employment_rate.png")

# 8. OBBBA: CBO change in household resources by decile
dec = {r["income_decile"]: float(r["avg_annual_change_usd"]) for r in read("obbba_cbo_household_resources_by_decile.csv")}
fig, ax = plt.subplots(figsize=(10, 5.2))
lo, mid_lo, mid_hi, hi = dec["1st (lowest 10%)"], dec["5th"], dec["6th"], dec["10th (highest 10%)"]
ax.bar(["Lowest 10%"], [lo], color=NEG, width=0.5, edgecolor=SURFACE, linewidth=2)
ax.bar(["Middle (5th–6th deciles)"], [mid_hi - mid_lo], bottom=[mid_lo], color=POS, width=0.5, edgecolor=SURFACE, linewidth=2)
ax.bar(["Highest 10%"], [hi], color=POS, width=0.5, edgecolor=SURFACE, linewidth=2)
ax.text(0, lo - 400, "−$1,200/yr\n−3.1% of income", ha="center", va="top", fontsize=10, color=INK)
ax.text(1, mid_hi + 400, "+$800 to +$1,200/yr\nunder 1% of income", ha="center", va="bottom", fontsize=10, color=INK)
ax.text(2, hi + 400, "+$13,600/yr\n+2.7% of income", ha="center", va="bottom", fontsize=10, color=INK)
ax.axhline(0, color=INK2, lw=1)
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(money))
ax.set_ylim(-4000, 17500)
ax.grid(axis="x", visible=False)
ax.set_ylabel("Average change in household resources per year")
title(ax, "2025 budget law: the poorest 10% lose about $1,200 a year; the richest 10% gain $13,600",
      "CBO: average annual change in household resources, 2026–2034, from P.L. 119-21 (2025 dollars)")
source(fig, "CBO letter, Distributional Effects of Public Law 119-21 (Aug 11, 2025), as reported by Thomson Reuters Checkpoint and NM Political Report.\n"
       "Middle deciles were reported only as a range ($800–$1,200), shown as a floating bar. Excludes tariffs, debt-service costs and economic feedback.")
save(fig, "08_obbba_cbo_change_by_decile.png")

# 9. OBBBA: where the federal savings come from (Medicaid + SNAP components)
bud = read("obbba_budget_and_coverage_effects.csv")
get = {r["item"].strip(): float(r["value"]) for r in bud}
med_total = -get["Medicaid provisions: change in federal outlays"]
med = [("Work requirement", -get["of which community engagement (work) requirement"]),
       ("Provider tax limits", -get["of which provider tax limits"]),
       ("State directed payments", -get["of which state directed payments"])]
med.append(("Other Medicaid", med_total - sum(v for _, v in med)))
snap_total = -get["Nutrition (SNAP) title: change in federal spending"]
snap = [("Work requirement", -get["of which work requirement (ABAWD) changes"]),
        ("State benefit cost share", -get["of which state share of benefit costs (from FY2028)"]),
        ("Thrifty Food Plan limits", -get["of which Thrifty Food Plan limits"]),
        ("State admin cost share", -get["of which state share of admin costs 50%->75% (from FY2027)"])]
snap.append(("Other SNAP (net)", snap_total - sum(v for _, v in snap)))
fig, axes = plt.subplots(1, 2, figsize=(12.5, 5), gridspec_kw={"width_ratios": [1, 1]})
for ax, items, total, ttl, col in ((axes[0], med, med_total, "Medicaid: ${:,.0f}B less federal spending", SEQ[1]),
                                   (axes[1], snap, snap_total, "SNAP: ${:,.0f}B less federal spending", SEQ[3])):
    names = [n for n, _ in items][::-1]
    vals = [v for _, v in items][::-1]
    ax.barh(names, vals, color=col, height=0.6, edgecolor=SURFACE, linewidth=2)
    for n, v in zip(names, vals):
        ax.text(v + total * 0.01, n, f"${v:,.1f}B", va="center", fontsize=9.5, color=INK)
    ax.set_xlim(0, max(vals) * 1.3)
    ax.grid(axis="y", visible=False)
    ax.set_title(ttl.format(total), loc="left", fontsize=11, color=INK)
    ax.set_xlabel("Reduction in federal spending, FY2025–2034 ($ billions)")
fig.suptitle("Where the 2025 law's safety-net savings come from (CBO, 10 years)", x=0.01, ha="left", fontsize=14, fontweight="bold")
source(fig, "Congressional Research Service R48633 (health) and R48552 (SNAP), citing CBO estimates of P.L. 119-21. 'Other' = Mandate calculation (total minus listed items).")
fig.tight_layout(rect=(0, 0.04, 1, 0.94))
save(fig, "09_obbba_medicaid_snap_savings.png")

# 10. IRS filing season: average refund
fs = {r["measure"]: r for r in read("irs_filing_season_2026_vs_2025.csv")}
fig, axes = plt.subplots(1, 2, figsize=(10.5, 4.4))
for ax, key, fmt, ttl in ((axes[0], "Average refund (USD)", lambda v: f"${v:,.0f}", "Average refund"),
                          (axes[1], "Total amount refunded (USD)", lambda v: f"${v / 1e9:,.0f}B", "Total refunded")):
    r = fs[key]
    v = [float(r["filing_season_2025"]), float(r["filing_season_2026"])]
    ax.bar(["2025 season\n(tax year 2024)", "2026 season\n(tax year 2025)"], v, color=[SEQ[5], SEQ[2]], width=0.55, edgecolor=SURFACE, linewidth=2)
    for i, val in enumerate(v):
        ax.text(i, val * 1.02, fmt(val), ha="center", fontsize=11, fontweight="bold", color=INK)
    ax.set_title(f"{ttl}: +{float(r['pct_change']):.1f}%", loc="left", fontsize=11, color=INK)
    ax.set_ylim(0, max(v) * 1.2)
    ax.yaxis.set_visible(False)
    ax.grid(False)
    ax.spines["left"].set_visible(False)
fig.suptitle("First filing season under the new law: refunds were bigger", x=0.01, ha="left", fontsize=14, fontweight="bold")
source(fig, "IRS filing season statistics, cumulative through May 8, 2026 vs May 9, 2025. Refund size also reflects withholding, so not all of the rise is the new law.")
fig.tight_layout(rect=(0, 0.04, 1, 0.93))
save(fig, "10_irs_refunds_2026_vs_2025.png")

print("charts written to", CHARTS)

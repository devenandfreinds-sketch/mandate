"""Rebuild every chart in ./charts from the CSVs in ./data.

Reads local files only (no network). Run from anywhere:
    python3 imports/research/six-city-disability-absence-brief-2026-11/build_charts.py
Requires matplotlib.
"""
import csv
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.lines import Line2D  # noqa: E402
from matplotlib.patches import Patch  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
CHARTS = os.path.join(HERE, "charts")
os.makedirs(CHARTS, exist_ok=True)

# Same reference palette as the other November 2026 briefs.
SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK2 = "#52514e"
MUTED = "#8a8985"
GRID = "#e6e5e0"
BLUE, ORANGE = "#2a78d6", "#eb6834"  # disability (SEN/IEP), 504 plan / second series
CONTEXT = "#b9b8b3"  # "without a disability" / other SEN

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
        "axes.spines.left": False,
        "axes.grid": True,
        "axes.grid.axis": "x",
        "grid.color": GRID,
        "grid.linewidth": 0.8,
        "axes.axisbelow": True,
        "text.color": INK,
    }
)


def read(name):
    with open(os.path.join(DATA, name), newline="") as f:
        return list(csv.DictReader(f))


def num(v):
    return float(v) if v not in ("", None) else None


def title(ax, t, sub):
    ax.set_title(t, loc="left", fontsize=14, fontweight="bold", color=INK, pad=26)
    ax.text(0, 1.02, sub, transform=ax.transAxes, fontsize=10, color=INK2, va="bottom")


def source(fig, s, y=-0.01):
    fig.text(0.01, y, "Source: " + s, fontsize=8, color=MUTED, ha="left", va="top", wrap=True)


def save(fig, name):
    fig.savefig(os.path.join(CHARTS, name), dpi=150, bbox_inches="tight")
    plt.close(fig)


def pct_axis(ax, top):
    ax.set_xlim(0, top)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:.0f}%"))
    ax.tick_params(axis="y", length=0)


def tick_marks(ax, ys, xs):
    for y, x in zip(ys, xs):
        ax.plot([x, x], [y - 0.38, y + 0.38], color=INK, lw=2.6, solid_capstyle="butt", zorder=4)


TICK_KEY = Line2D([0], [0], color=INK, lw=2.6, label="Share of all students with a disability")

# 1. Share of chronically absent students with a disability ------------------------------
rows = sorted(read("chronic_absence_by_disability.csv"), key=lambda r: num(r["share_disability_pct"]))
ys = list(range(len(rows)))
share = [num(r["share_disability_pct"]) for r in rows]
extra = [(num(r["share_incl_504_pct"]) - num(r["share_disability_pct"])) if r["share_incl_504_pct"] else 0 for r in rows]
enrol = [num(r["enrol_share_disability_pct"]) for r in rows]
fig, ax = plt.subplots(figsize=(10, 5.4))
ax.barh(ys, share, color=BLUE, height=0.62)
ax.barh(ys, extra, left=share, color=ORANGE, height=0.62)
tick_marks(ax, ys, enrol)
for y, s, e, r in zip(ys, share, extra, rows):
    label = f"{s:.1f}%" + (f"  ({s + e:.1f}% with 504)" if e else "") + ("  est." if r["estimated"] == "yes" else "")
    ax.text(s + e + 0.6, y, label, va="center", fontsize=9.5, color=INK)
ax.set_yticks(ys, [f"{r['city']} ({r['year']})" for r in rows])
pct_axis(ax, 48)
ax.legend(handles=[Patch(color=BLUE, label="With a disability (SEN or IEP)"), Patch(color=ORANGE, label="Plus 504 plans"), TICK_KEY],
          loc="lower right", frameon=False, fontsize=9)
title(ax, "Students with disabilities are over-represented among the chronically absent",
      "Share of chronically absent public-school students who have a disability; tick = their share of all students")
source(fig, "DfE; NYC DOE; OSPI; OSSE; ISBE; CEPI MI School Data. DC and Chicago estimated from published rates x student counts.")
save(fig, "01_absence_share_with_disability.png")

# 2. Chronic absence rate, with vs without a disability -----------------------------------
rows = sorted(read("chronic_absence_by_disability.csv"), key=lambda r: num(r["rate_disability_pct"]) - num(r["rate_without_pct"]))
ys = list(range(len(rows)))
fig, ax = plt.subplots(figsize=(10, 5.2))
for y, r in zip(ys, rows):
    a, b = num(r["rate_without_pct"]), num(r["rate_disability_pct"])
    ax.plot([a, b], [y, y], color=CONTEXT, lw=3, zorder=2)
    ax.plot(a, y, "o", color=CONTEXT, ms=10, mec=SURFACE, mew=1.5, zorder=3)
    ax.plot(b, y, "o", color=BLUE, ms=10, mec=SURFACE, mew=1.5, zorder=3)
    ax.text(a - 1.2, y, f"{a:.1f}%", ha="right", va="center", fontsize=9.5, color=INK2)
    ax.text(b + 1.2, y, f"{b:.1f}%  (+{b - a:.1f} pts)", ha="left", va="center", fontsize=9.5, color=INK)
ax.set_yticks(ys, [r["city"] for r in rows])
pct_axis(ax, 62)
ax.legend(handles=[Line2D([0], [0], marker="o", color=SURFACE, markerfacecolor=CONTEXT, ms=10, label="Without a disability"),
                   Line2D([0], [0], marker="o", color=SURFACE, markerfacecolor=BLUE, ms=10, label="With a disability")],
          loc="lower right", frameon=False, fontsize=9)
title(ax, "Students with disabilities are chronically absent more often in every city",
      "Chronic absence rate, public schools, 2024-25 (Manchester: SEN vs no identified SEN)")
source(fig, "Same as chart 1. Chicago's 'without' rate is estimated from published rates and enrolment.")
save(fig, "02_absence_rate_with_vs_without.png")

# 3. Discipline share ----------------------------------------------------------------------
rows = sorted([r for r in read("discipline_by_disability.csv") if r["primary_measure"] == "yes"], key=lambda r: num(r["share_disability_pct"]))
ys = list(range(len(rows)))
share = [num(r["share_disability_pct"]) for r in rows]
extra = [100 * num(r["with_504"]) / num(r["total"]) if r["with_504"] else 0 for r in rows]
fig, ax = plt.subplots(figsize=(10, 5.4))
ax.barh(ys, share, color=BLUE, height=0.62)
ax.barh(ys, extra, left=share, color=ORANGE, height=0.62)
tick_marks(ax, ys, [num(r["enrol_share_disability_pct"]) for r in rows])
for y, s, e, r in zip(ys, share, extra, rows):
    label = f"{s:.1f}%" + (f"  (+{e:.1f}% 504)" if e else "") + ("  est." if r["estimated"] == "yes" else "")
    ax.text(s + e + 0.6, y, label, va="center", fontsize=9.5, color=INK)
ax.set_yticks(ys, [f"{r['city']} ({r['year']})\n{r['action'].lower()}" for r in rows], fontsize=9.5)
pct_axis(ax, 66)
ax.legend(handles=[Patch(color=BLUE, label="Students with a disability"), Patch(color=ORANGE, label="Plus 504 plans (Seattle)"), TICK_KEY],
          loc="lower right", frameon=False, fontsize=9)
title(ax, "Students with disabilities receive a disproportionate share of discipline",
      "Share of disciplinary actions (or disciplined students) involving students with disabilities; tick = share of students")
source(fig, "DfE; NYC DOE Local Law 93; OSPI; OSSE; ISBE; US Dept. of Education CRDC 2021-22 (East Lansing). Cities count different things.")
save(fig, "03_discipline_share_with_disability.png")

# 4. Over-representation -------------------------------------------------------------------
absence = {r["city"]: r for r in read("chronic_absence_by_disability.csv")}
disc = {r["city"]: r for r in read("discipline_by_disability.csv") if r["primary_measure"] == "yes"}
cities = sorted(absence, key=lambda c: num(disc[c]["share_disability_pct"]) / num(disc[c]["enrol_share_disability_pct"]))
ab_ratio = [num(absence[c]["share_disability_pct"]) / num(absence[c]["enrol_share_disability_pct"]) for c in cities]
di_ratio = [num(disc[c]["share_disability_pct"]) / num(disc[c]["enrol_share_disability_pct"]) for c in cities]
ys = list(range(len(cities)))
fig, ax = plt.subplots(figsize=(10, 5.4))
h = 0.36
ax.barh([y + h / 2 for y in ys], ab_ratio, height=h, color=BLUE, label="Chronic absence")
ax.barh([y - h / 2 for y in ys], di_ratio, height=h, color=ORANGE, label="Discipline")
for y, a, d in zip(ys, ab_ratio, di_ratio):
    ax.text(a + 0.04, y + h / 2, f"{a:.1f}x", va="center", fontsize=9, color=INK)
    ax.text(d + 0.04, y - h / 2, f"{d:.1f}x", va="center", fontsize=9, color=INK)
ax.axvline(1, color=INK, lw=1.2, ls=(0, (4, 3)))
ax.text(1.03, len(ys) - 0.45, "1x = no over-representation", fontsize=8.5, color=INK2)
ax.set_yticks(ys, cities)
ax.set_xlim(0, 3.6)
ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:.1f}x"))
ax.tick_params(axis="y", length=0)
ax.legend(loc="lower right", frameon=False, fontsize=9)
title(ax, "Over-representation is larger for discipline than for absence",
      "Share of chronic absence and of discipline divided by share of enrolment, students with disabilities")
source(fig, "Charts 1 and 3. East Lansing discipline is 2021-22 and rests on 30 suspensions.")
save(fig, "04_over_representation.png")

# 5. Manchester by type of need ------------------------------------------------------------
rows = [r for r in read("manchester_persistent_absence_by_sen_need_2024_25.csv") if r["group"] != "No SEN"]
groups = {}
for r in rows:
    key = r["group"] if r["group"] != "Other SEN" else r["need"]
    if r["need"] in ("Other difficulty/disability", "No specialist assessment", "Unclassified"):
        key = "Other or unclassified"
    groups.setdefault(key, [r["group"], 0.0, 0])
    groups[key][1] += num(r["share_of_all_persistent_absentees_pct"])
    groups[key][2] += int(r["persistent_absentees"])
items = sorted(groups.items(), key=lambda kv: kv[1][1])
colour = {"Intellectual": BLUE, "Physical or sensory": ORANGE}
ys = list(range(len(items)))
fig, ax = plt.subplots(figsize=(10, 5.4))
ax.barh(ys, [v[1] for _, v in items], color=[colour.get(v[0], CONTEXT) for _, v in items], height=0.62)
for y, (k, v) in zip(ys, items):
    ax.text(v[1] + 0.15, y, f"{v[1]:.1f}%  ({v[2]:,} pupils)", va="center", fontsize=9.5, color=INK)
ax.set_yticks(ys, [k for k, _ in items])
pct_axis(ax, 15)
ax.legend(handles=[Patch(color=BLUE, label="Intellectual (MLD, SLD, PMLD, Down syndrome)"),
                   Patch(color=ORANGE, label="Physical or sensory (PD, HI, VI, MSI)"), Patch(color=CONTEXT, label="Other SEN")],
          loc="lower right", frameon=False, fontsize=9)
title(ax, "Manchester: most absent pupils with SEN have non-physical, non-intellectual needs",
      "Persistently absent pupils by main SEN need, share of all 15,728 persistently absent pupils, 2024/25 (63.9% have no SEN)")
source(fig, "DfE, Pupil absence in schools in England 2024/25, absence by pupil characteristics (Manchester LA).")
save(fig, "05_manchester_absence_by_need.png")

# 6. US federal cross-check, 2022-23 ---------------------------------------------------------
rows = sorted(read("us_federal_chronic_absence_by_disability_2022_23.csv"), key=lambda r: num(r["iep_share_pct"]) + num(r["share_504_pct"]))
ys = list(range(len(rows)))
iep = [num(r["iep_share_pct"]) for r in rows]
s504 = [num(r["share_504_pct"]) for r in rows]
fig, ax = plt.subplots(figsize=(10, 4.6))
ax.barh(ys, iep, color=BLUE, height=0.62, label="IEP")
ax.barh(ys, s504, left=iep, color=ORANGE, height=0.62, label="504 plan")
for y, a, b in zip(ys, iep, s504):
    ax.text(a + b + 0.4, y, f"{a + b:.1f}%  (IEP {a:.1f}% + 504 {b:.1f}%)", va="center", fontsize=9.5, color=INK)
ax.set_yticks(ys, [r["city"] for r in rows])
pct_axis(ax, 42)
ax.legend(loc="lower right", frameon=False, fontsize=9)
title(ax, "On one federal definition, the US cities sit close together",
      "Share of chronically absent students with an IEP or 504 plan, school year 2022-23")
source(fig, "US Department of Education, EDFacts FS195 chronic absenteeism LEA file, SY2022-23.")
save(fig, "06_us_federal_2022_23.png")

# 7. England and Greater Manchester trend ----------------------------------------------------
rows = read("england_and_greater_manchester_persistent_absence_by_sen.csv")
years = sorted({r["academic_year"] for r in rows})
fig, ax = plt.subplots(figsize=(9, 4.6))
ax.grid(axis="y")
ax.grid(axis="x", visible=False)
for area, colour_, dy in (("England", CONTEXT, -10), ("Greater Manchester (10 LAs)", BLUE, 8)):
    vals = [num(next(r for r in rows if r["area"] == area and r["academic_year"] == y)["share_any_sen_pct"]) for y in years]
    ax.plot(years, vals, color=colour_, lw=2.4, marker="o", ms=7, mec=SURFACE, mew=2, label=area)
    for x, v in zip(years, vals):
        ax.annotate(f"{v:.1f}%", (x, v), xytext=(0, dy), textcoords="offset points", ha="center", fontsize=9, color=INK)
ax.set_ylim(20, 40)
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:.0f}%"))
ax.spines["left"].set_visible(False)
ax.legend(loc="upper left", frameon=False, fontsize=9)
title(ax, "The SEN share of persistent absence is rising",
      "Share of persistently absent pupils with SEN (EHC plan or SEN support), state-funded schools")
source(fig, "DfE, Pupil absence in schools in England, absence by pupil characteristics.")
save(fig, "07_england_gm_sen_share_trend.png")

print("Wrote", len(os.listdir(CHARTS)), "charts to", CHARTS)

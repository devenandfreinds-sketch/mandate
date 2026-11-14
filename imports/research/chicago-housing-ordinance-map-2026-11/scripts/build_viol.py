"""Open residential housing-code violations (last 24 months), grouped by address and by the
Municipal Code of Chicago area each violation cites. Writes site/viol.json.
Run from anywhere:  python3 scripts/build_viol.py"""
import datetime, re
from collections import Counter
from common import soql, norm, write

TODAY = datetime.date.today()
SINCE = (TODAY.replace(year=TODAY.year - 2)).isoformat()  # violations issued in the last two years

rows = soql("22u3-xenr", {
    "$select": "address,violation_date,violation_description,violation_ordinance,inspection_category,latitude,longitude",
    "$where": f"violation_status='OPEN' AND department_bureau='CONSERVATION' AND violation_date > '{SINCE}'"})
print("rows", len(rows))

# Category order = severity order (0 most serious). Matched on description + ordinance text.
CATS = [
    ("fire",  ["SMOKE", "CARB MONOX", "CARBON MONOXIDE", "EXIT", "FIRE ESCAPE", "FIRE ALARM", "SPRINKLER", "STAIRWELL", "CLASS B DOOR", "13-64-", "13-160-", "13-196-080", "13-196-100"]),
    ("heat",  ["HEAT", "HOT W", "HOT WTR", "WATER SUPPLY", "GAS ", "13-196-410", "ELECTRIC", "WIRING", "OUTLET", "PLUMB", "SEWER", "TOILET", "LEAK", "18-27-", "18-29-", "BOILER", "VENT"]),
    ("struct",["PORCH", "STAIR", "PARAPET", "CHIMNEY", "LINTEL", "STRUCTUR", "FOUNDATION", "ROOF", "CORNICE", "EXTERIOR WALL", "DANGER", "WRECK", "13-196-570", "13-196-530"]),
    ("pests", ["ROACH", "RAT", "RODENT", "MICE", "INSECT", "BED BUG", "GARBAGE", "DEBRIS", "WEEDS", "NUISANCE", "REFRIGERATOR", "SANIT", "7-28-", "13-196-630"]),
]
def cat(desc, ordn):
    t = f" {(desc or '').upper()} {(ordn or '').upper()} "
    d = (desc or "").upper()
    if "EXTNGSHR" in t or "PERMIT" in d or "PLANS" in d: return len(CATS)
    if "NOXIOUS" in d or "ODOR" in d: return 3
    if "GUTTER" in d or "DOWNSPOUT" in d: return 2
    for i, (_, keys) in enumerate(CATS):
        if any(k in t for k in keys): return i
    return len(CATS)  # 4 = other upkeep / permits / access

def cites(ordn):
    return re.findall(r"\b\d{1,2}X?-\d{1,3}-\d{2,4}(?:\s?\([a-zA-Z0-9]\))?", ordn or "")

A = {}
for r in rows:
    k = norm(r.get("address"))
    if not k: continue
    a = A.setdefault(k, {"p": None, "n": 0, "d": "", "cc": [0]*5, "items": Counter(), "cite": {}})
    if a["p"] is None and r.get("latitude"): a["p"] = [round(float(r["latitude"]), 5), round(float(r["longitude"]), 5)]
    c = cat(r.get("violation_description"), r.get("violation_ordinance"))
    a["n"] += 1; a["cc"][c] += 1
    d = (r.get("violation_date") or "")[:10]
    if d > a["d"]: a["d"] = d
    desc = (r.get("violation_description") or "").strip().title() or "Unspecified"
    a["items"][(c, desc)] += 1
    cs = cites(r.get("violation_ordinance"))
    if cs and (c, desc) not in a["cite"]: a["cite"][(c, desc)] = cs[0].replace(" ", "")

out = []
for k, a in A.items():
    if not a["p"]: continue
    worst = next(i for i, x in enumerate(a["cc"]) if x)
    items = sorted(a["items"].items(), key=lambda kv: (kv[0][0], -kv[1]))[:8]
    out.append({"a": k, "p": a["p"], "c": worst, "n": a["n"], "d": a["d"], "cc": a["cc"],
                "v": [[c, desc, cnt, a["cite"].get((c, desc), "")] for (c, desc), cnt in items]})
write("viol", out)
print("addresses by most serious category", sorted(Counter(o["c"] for o in out).items()))

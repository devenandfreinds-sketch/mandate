"""Pull the vacant-building, public-list and registry layers plus the base-map boundaries.

Writes site/{vacant311,vacantOld,hearings,scofflaw,foreclosed,prohibited,restricted,meta,geo}.json.
Run from anywhere:  python3 scripts/fetch_layers.py
"""
import datetime, json, os, re
from collections import defaultdict
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from common import soql, download, norm, f, write, RAW

TODAY = datetime.date.today()
SINCE = (TODAY.replace(year=TODAY.year - 2)).isoformat()  # 311 reports: last two years

# ---- Map 2: vacant buildings -------------------------------------------------------------
# 311 "Vacant/Abandoned Building Complaint" requests (v6vf-nfxy), duplicates dropped.
sr = soql("v6vf-nfxy", {
    "$select": "sr_number,status,created_date,street_address,latitude,longitude,duplicate",
    "$where": f"sr_type='Vacant/Abandoned Building Complaint' AND created_date > '{SINCE}'"})
write("vacant311", [{"a": norm(s.get("street_address")), "p": [f(s["latitude"]), f(s["longitude"])],
                     "d": (s.get("created_date") or "")[:10], "st": s.get("status"), "sr": s.get("sr_number")}
                    for s in sr if not s.get("duplicate") and f(s.get("latitude"))])

# Department of Buildings vacant-building violation codes (MCC 13-12-125 et seq.) still marked OPEN.
# The city largely stopped issuing these codes in this dataset after 2019, so most are 2015-2019.
VAC_CODES = ['CN193110', 'CN193019', 'CN193029', 'CN196039', 'CN193039', 'CN193100', 'CN193105', 'CN193106',
             'CN193107', 'CN193002', 'CN193001', 'CN193339', 'CN193301', 'CN193302', 'CN193329', 'CN193303']
vac = soql("22u3-xenr", {
    "$select": "address,violation_date,latitude,longitude",
    "$where": "violation_status='OPEN' AND violation_code in(" + ",".join(f"'{c}'" for c in VAC_CODES) + ")"})
old = defaultdict(lambda: {"n": 0, "d": "", "p": None})
for v in vac:
    k = norm(v.get("address"))
    if not k or not f(v.get("latitude")):
        continue
    o = old[k]; o["n"] += 1
    o["p"] = o["p"] or [f(v["latitude"]), f(v["longitude"])]
    o["d"] = max(o["d"], (v.get("violation_date") or "")[:10])
write("vacantOld", [{"a": k, **o} for k, o in old.items()])

# Administrative-hearing cases on vacant buildings owned by financial institutions (kc9i-wq85).
hear = soql("kc9i-wq85", {"$select": "issued_date,issuing_department,property_address,violation_type,entity_or_person_s_,disposition_description,current_amount_due,latitude,longitude"})
write("hearings", [{"a": norm(h.get("property_address")), "p": [f(h["latitude"]), f(h["longitude"])],
                    "d": (h.get("issued_date") or "")[:10], "dep": h.get("issuing_department"),
                    "who": (h.get("entity_or_person_s_") or "").strip(" ,"),
                    "vt": (h.get("violation_type") or "").split("|")[0][:90],
                    "disp": h.get("disposition_description"), "due": f(h.get("current_amount_due"), 0)}
                   for h in hear if f(h.get("latitude"))])

# ---- Map 3: public lists and registries ------------------------------------------------
# Building Code Scofflaw List (MCC 2-92-416), every published snapshot; the newest is "current".
scof = soql("crg5-4zyp", {})
latest = max(r["building_list_date"] for r in scof)
write("scofflaw", [{"a": norm(s.get("address")), "p": [f(s["latitude"]), f(s["longitude"])],
                    "o": s.get("defendant_owner"), "bd": (s.get("building_list_date") or "")[:10],
                    "od": (s.get("owner_list_date") or "")[:10], "c": s.get("community_area"),
                    "cur": s["building_list_date"] == latest, "case": s.get("circuit_court_case_number")}
                   for s in scof if f(s.get("latitude"))])

# Foreclosed rental property registry (Keep Chicago Renting Ordinance), location is WKT.
def wkt(p):
    m = re.match(r"POINT \(([-\d.]+) ([-\d.]+)\)", p or "")
    return [f(m.group(2)), f(m.group(1))] if m else None
fore = soql("yhcw-iu53", {"$select": "property_address,submission_date,owner_name,location"})
write("foreclosed", [{"a": norm(x.get("property_address")), "p": wkt(x.get("location")),
                      "d": (x.get("submission_date") or "")[:10], "o": x.get("owner_name")}
                     for x in fore if wkt(x.get("location"))])

# House Share Prohibited Buildings List (MCC 4-13-260(a)(9)).
pbl = soql("7bzs-jsyj", {"$select": "address_number,street_direction,street_name,street_type,association_cooperative_or_owner,number_of_units,recorded_date,latitude,longitude"})
write("prohibited", [{"a": norm(" ".join(filter(None, [x.get("address_number"), x.get("street_direction"), x.get("street_name"), x.get("street_type")]))),
                      "p": [f(x["latitude"]), f(x["longitude"])], "o": x.get("association_cooperative_or_owner"),
                      "u": x.get("number_of_units"), "d": (x.get("recorded_date") or "")[:10]}
                     for x in pbl if f(x.get("latitude"))])

# Restricted Residential Zone precincts (MCC Chapter 4-17).
rrz = soql("8eww-pamb", {})
restricted = [{"w": x.get("ward"), "pr": x.get("precinct"), "eff": (x.get("ordinance_effective_date") or "")[:10],
               "scope": x.get("scope_of_restriction"), "url": (x.get("enacting_ordinance") or {}).get("url")} for x in rrz]

# ---- Boundaries --------------------------------------------------------------------------
def geojson(ds):
    return json.load(open(download(f"https://data.cityofchicago.org/api/geospatial/{ds}?method=export&format=GeoJSON",
                                   os.path.join(RAW, ds + ".geojson"))))["features"]

def rnd(g, nd=5):
    def r(c): return [r(x) for x in c] if isinstance(c[0], (list, tuple)) else [round(c[0], nd), round(c[1], nd)]
    m = mapping(g); return {"type": m["type"], "coordinates": r(m["coordinates"])}

feats, polys = [], []
for ft in geojson("igwz-8jzy"):  # community areas
    g = shape(ft["geometry"]); polys.append(g); p = g.representative_point()
    feats.append({"type": "Feature", "properties": {"n": int(float(ft["properties"]["area_numbe"])), "name": ft["properties"]["community"].title(),
                  "lab": [round(p.y, 4), round(p.x, 4)]}, "geometry": rnd(g.simplify(0.00025, preserve_topology=True))})
city = unary_union(polys).buffer(0.0004).buffer(-0.0004).simplify(0.0003)

# Zones enacted after the 2023 ward remap are drawn on the 2023-24 precinct map (6piy-vbxa);
# older zones used earlier precinct lines and are kept in restricted.json only.
pre = {(str(int(float(x["properties"]["ward"]))), str(int(float(x["properties"]["precinct"])))): x for x in geojson("6piy-vbxa")}
zones = []
for r in restricted:
    r["mapped"] = False
    if r["eff"] >= "2023-05-15" and (r["w"], r["pr"]) in pre:
        r["mapped"] = True
        zones.append({"type": "Feature", "properties": {k: r[k] for k in ("w", "pr", "eff", "scope", "url")},
                      "geometry": rnd(shape(pre[(r["w"], r["pr"])]["geometry"]).simplify(0.0001, preserve_topology=True))})
write("restricted", restricted)
print("restricted zones drawn:", len(zones), "of", len(restricted))
json.dump({"ca": {"type": "FeatureCollection", "features": feats}, "city": rnd(city),
           "rrz": {"type": "FeatureCollection", "features": zones}},
          open(os.path.join(os.path.dirname(RAW), "site", "geo.json"), "w"), separators=(",", ":"))
json.dump({"generated": TODAY.isoformat(), "scofflaw_latest": latest[:10]},
          open(os.path.join(os.path.dirname(RAW), "site", "meta.json"), "w"))
print("wrote geo.json and meta.json")

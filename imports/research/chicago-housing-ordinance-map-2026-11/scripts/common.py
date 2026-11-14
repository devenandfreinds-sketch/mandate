"""Shared helpers: Socrata (SoQL) paging against the Chicago Data Portal, address normalising, paths."""
import json, os, re, sys, time, urllib.parse, urllib.request

BASE = "https://data.cityofchicago.org/resource/"
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(HERE, "raw")    # downloaded boundary files (git-ignored)
SITE = os.path.join(HERE, "site")  # what gets published / opened in a browser
os.makedirs(RAW, exist_ok=True); os.makedirs(SITE, exist_ok=True)


def soql(ds, params, page=50000):
    """Fetch every row of a SoQL query, paging by $offset."""
    rows, off = [], 0
    while True:
        p = dict(params); p["$limit"] = page; p["$offset"] = off
        p.setdefault("$order", ":id")
        url = BASE + ds + ".json?" + urllib.parse.urlencode(p)
        for attempt in range(4):
            try:
                with urllib.request.urlopen(url, timeout=300) as r:
                    chunk = json.load(r)
                break
            except Exception as e:  # network hiccup: back off and retry
                print("retry", ds, e, file=sys.stderr); time.sleep(3 * (attempt + 1))
        else:
            raise SystemExit("failed to fetch " + ds)
        rows += chunk; off += page
        if len(chunk) < page:
            return rows


def download(url, path):
    if not os.path.exists(path):
        urllib.request.urlretrieve(url, path)
    return path


def norm(a):
    return re.sub(r"\s+", " ", (a or "").upper()).strip()


def f(x, nd=5):
    try:
        return round(float(x), nd)
    except (TypeError, ValueError):
        return None


def write(name, obj):
    path = os.path.join(SITE, name + ".json")
    json.dump(obj, open(path, "w"), separators=(",", ":"))
    print(f"wrote {name}.json  {len(obj) if isinstance(obj, list) else ''}  {os.path.getsize(path):,} bytes")

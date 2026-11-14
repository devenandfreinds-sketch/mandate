"""Assemble site/index.html from page/index.src.html, inlining Leaflet's stylesheet
(the published page may only load scripts from a CDN, so the CSS has to be inline)."""
import os, urllib.request
from common import HERE, SITE, RAW, download

css = open(download("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css", os.path.join(RAW, "leaflet.css"))).read()
src = open(os.path.join(HERE, "page", "index.src.html")).read()
assert "/*LEAFLET_CSS*/" in src
open(os.path.join(SITE, "index.html"), "w").write(src.replace("/*LEAFLET_CSS*/", css))
print("wrote site/index.html")

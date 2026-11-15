const C = dash.colors;
const BAD = 'var(--color-bad)';
const num = (v, dp) => (v == null || v === '' ? '—' : d3.format(dp == null ? ',.2~f' : ',.' + dp + 'f')(v).replace('-', '−'));
const okRows = (id) => { const s = dash.data(id); return s.status === 'ok' && Array.isArray(s.data) ? s.data : null; };

function waiting(el, ids) {
  const st = ids.map((id) => dash.data(id).status);
  if (st.every((s) => s === 'ok')) { el.classList.remove('dash-skeleton'); return false; }
  if (!st.includes('loading')) el.classList.remove('dash-skeleton');
  el.replaceChildren();
  el.textContent = st.includes('error') ? 'Failed to load' : '—';
  return true;
}

function frame(el, aria, hOf) {
  el.replaceChildren();
  const w = Math.max(260, Math.floor(el.clientWidth || 600));
  const h = Math.round(typeof hOf === 'function' ? hOf(w) : hOf);
  const box = d3.select(el).append('div').attr('class', 'fr-box');
  const svg = box.append('svg').attr('width', '100%').attr('viewBox', '0 0 ' + w + ' ' + h).attr('role', 'img').attr('aria-label', aria);
  const tip = box.append('div').attr('class', 'fr-tip').style('display', 'none');
  const show = (evt, lines) => {
    tip.style('display', 'block');
    tip.selectAll('div').data(lines).join('div').attr('class', (d, i) => (i ? null : 'fr-tip-h')).text((d) => d);
    const r = box.node().getBoundingClientRect();
    const tw = tip.node().offsetWidth, th = tip.node().offsetHeight;
    let x = evt.clientX - r.left + 12, y = evt.clientY - r.top - th - 10;
    if (x + tw > r.width) x = evt.clientX - r.left - tw - 12;
    if (x < 0) x = 0;
    if (y < 0) y = evt.clientY - r.top + 16;
    tip.style('left', x + 'px').style('top', y + 'px');
  };
  const hide = () => tip.style('display', 'none');
  return { svg, w, h, show, hide };
}
const hover = (sel, show, hide, lines) => sel
  .on('pointerenter pointermove pointerdown', (e, d) => show(e, lines(d)))
  .on('pointerleave', hide);

function lineChart(el, o) {
  const { svg, w, h, show, hide } = frame(el, o.aria, o.h || 260);
  const m = { t: 14, r: 46, b: 24, l: 34 };
  const data = o.rows.map((r) => ({ r, t: new Date(r[o.x]) }));
  const x = d3.scaleUtc().domain(d3.extent(data, (d) => d.t)).range([m.l, w - m.r]);
  const vals = o.series.flatMap((s) => o.rows.map((r) => r[s.key])).filter((v) => v != null);
  const y = d3.scaleLinear().domain([o.y0 != null ? o.y0 : d3.min(vals), d3.max(vals)]).nice(5).range([h - m.b, m.t]);
  const g = svg.append('g');
  g.selectAll('line').data(y.ticks(5)).join('line').attr('x1', m.l).attr('x2', w - m.r).attr('y1', y).attr('y2', y).attr('stroke', 'var(--cds-chart-grid)');
  g.selectAll('text').data(y.ticks(5)).join('text').attr('x', m.l - 6).attr('y', y).attr('dy', '0.32em').attr('text-anchor', 'end').text((d) => num(d));
  const xt = x.ticks(Math.max(2, Math.floor((w - m.l - m.r) / 70)));
  svg.append('g').selectAll('text').data(xt).join('text').attr('x', x).attr('y', h - 6).attr('text-anchor', 'middle').text(d3.utcFormat('%Y'));
  o.series.forEach((s, i) => {
    const pts = data.filter((d) => d.r[s.key] != null);
    svg.append('path').attr('d', d3.line().x((d) => x(d.t)).y((d) => y(d.r[s.key]))(pts)).attr('fill', 'none').style('stroke', C[i]).attr('stroke-width', 2).attr('stroke-linejoin', 'round');
    const last = pts[pts.length - 1];
    svg.append('circle').attr('cx', x(last.t)).attr('cy', y(last.r[s.key])).attr('r', 3.5).style('fill', C[i]);
    svg.append('text').attr('class', 'fr-val').attr('x', x(last.t) + 7).attr('y', y(last.r[s.key]) + (o.series.length > 1 ? (i ? 9 : -3) : 0)).attr('dy', '0.32em').text(num(last.r[s.key], o.dp) + (o.unit || ''));
  });
  const rule = svg.append('line').attr('y1', m.t).attr('y2', h - m.b).attr('stroke', 'var(--cds-chart-axis)').style('display', 'none');
  const bis = d3.bisector((d) => d.t).center;
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', w - m.l - m.r).attr('height', h - m.t - m.b).attr('fill', 'transparent')
    .on('pointerenter pointermove pointerdown', (e) => {
      const d = data[bis(data, x.invert(d3.pointer(e)[0]))];
      rule.style('display', null).attr('x1', x(d.t)).attr('x2', x(d.t));
      show(e, [d.r[o.name]].concat(o.series.map((s) => s.label + ': ' + num(d.r[s.key], o.dp) + (o.unit || ''))));
    })
    .on('pointerleave', () => { rule.style('display', 'none'); hide(); });
}

function vbars(el, o) {
  const { svg, w, h, show, hide } = frame(el, o.aria, o.h || 260);
  const m = { t: 18, r: 6, b: o.twoLine ? 38 : 24, l: 38 };
  const cats = o.rows.map((r) => r[o.cat]);
  const x0 = d3.scaleBand().domain(cats).range([m.l, w - m.r]).paddingInner(0.22).paddingOuter(0.08);
  const x1 = d3.scaleBand().domain(o.series.map((s) => s.key)).range([0, x0.bandwidth()]).padding(0.08);
  const vals = o.series.flatMap((s) => o.rows.map((r) => r[s.key])).filter((v) => v != null);
  const y = d3.scaleLinear().domain([Math.min(0, d3.min(vals)), Math.max(0, d3.max(vals))]).nice(5).range([h - m.b - (d3.min(vals) < 0 ? 16 : 0), m.t]);
  const g = svg.append('g');
  g.selectAll('line').data(y.ticks(5)).join('line').attr('x1', m.l).attr('x2', w - m.r).attr('y1', y).attr('y2', y).attr('stroke', (d) => (d === 0 ? 'var(--cds-chart-axis)' : 'var(--cds-chart-grid)'));
  g.selectAll('text').data(y.ticks(5)).join('text').attr('x', m.l - 6).attr('y', y).attr('dy', '0.32em').attr('text-anchor', 'end').text((d) => num(d));
  const bars = o.rows.flatMap((r) => o.series.map((s, i) => ({ r, s, i, v: r[s.key] }))).filter((d) => d.v != null);
  hover(svg.append('g').selectAll('rect').data(bars).join('rect')
    .attr('x', (d) => x0(d.r[o.cat]) + x1(d.s.key)).attr('width', x1.bandwidth())
    .attr('y', (d) => Math.min(y(d.v), y(0))).attr('height', (d) => Math.max(1, Math.abs(y(d.v) - y(0)))).attr('rx', 2)
    .style('fill', (d) => (o.color ? o.color(d) : C[d.i])).attr('fill-opacity', (d) => (o.soft && o.soft(d.r) ? 0.5 : 1)),
  show, hide, (d) => [d.r[o.name || o.cat], d.s.label + ': ' + num(d.v, o.dp) + (o.unit || '')].concat(o.extra ? o.extra(d.r) : []));
  if (x1.bandwidth() >= 24) {
    svg.append('g').selectAll('text').data(bars).join('text').attr('class', 'fr-val').attr('text-anchor', 'middle')
      .attr('x', (d) => x0(d.r[o.cat]) + x1(d.s.key) + x1.bandwidth() / 2)
      .attr('y', (d) => (d.v >= 0 ? y(d.v) - 5 : y(d.v) + 13)).text((d) => num(d.v, o.dp));
  }
  const lab = o.catFmt || ((c) => c);
  const every = o.catFmt ? 1 : Math.ceil(40 / x0.step());
  const tx = svg.append('g').selectAll('text').data(cats.filter((c, i) => i % every === 0)).join('text').attr('text-anchor', 'middle')
    .attr('x', (c) => x0(c) + x0.bandwidth() / 2).attr('y', h - m.b + 16);
  if (o.twoLine) tx.selectAll('tspan').data((c) => String(c).split(', ').map((t) => ({ t, c }))).join('tspan').attr('x', (d) => x0(d.c) + x0.bandwidth() / 2).attr('dy', (d, i) => (i ? '1.15em' : 0)).text((d) => d.t);
  else tx.text(lab);
}

function hbars(el, o) {
  const rh = 28, m = { t: 4, r: 52, b: 4 };
  const { svg, w, show, hide } = frame(el, o.aria, o.rows.length * rh + m.t + m.b);
  const labels = svg.append('g').selectAll('text').data(o.rows).join('text').attr('class', 'fr-cat').attr('x', 0).attr('y', (d, i) => m.t + i * rh + rh / 2).attr('dy', '0.32em').text((d) => d[o.cat]);
  let lw = 0;
  labels.each(function (d) { lw = Math.max(lw, this.getComputedTextLength() || String(d[o.cat]).length * 6.6); });
  const l = Math.min(lw + 10, w * 0.5);
  const vals = o.rows.map((r) => r[o.key]);
  const x = d3.scaleLinear().domain([Math.min(0, d3.min(vals)), Math.max(0, d3.max(vals))]).range([l, w - m.r]);
  hover(svg.append('g').selectAll('rect').data(o.rows).join('rect')
    .attr('x', (d) => Math.min(x(d[o.key]), x(0))).attr('width', (d) => Math.max(1, Math.abs(x(d[o.key]) - x(0))))
    .attr('y', (d, i) => m.t + i * rh + 5).attr('height', rh - 10).attr('rx', 2)
    .style('fill', (d) => (o.color ? o.color(d) : C[0])).attr('fill-opacity', (d) => (o.soft && o.soft(d) ? 0.5 : 1)),
  show, hide, (d) => [d[o.cat], (o.label || '') + num(d[o.key], o.dp) + (o.unit || '')].concat(o.extra ? o.extra(d) : []));
  svg.append('g').selectAll('text').data(o.rows).join('text').attr('class', 'fr-val')
    .attr('x', (d) => Math.max(x(d[o.key]), x(0)) + 6).attr('y', (d, i) => m.t + i * rh + rh / 2).attr('dy', '0.32em').text((d) => num(d[o.key], o.dp) + (o.unit || ''));
  svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', m.t).attr('y2', m.t + o.rows.length * rh).attr('stroke', 'var(--cds-chart-axis)');
}

function mapBase(el, aria) {
  const f = frame(el, aria, (w) => Math.min(w * 0.94, 470));
  const proj = d3.geoConicConformal().parallels([44, 49]).rotate([-3, 0]).fitExtent([[6, 6], [f.w - 6, f.h - 6]], window.FR_GEO);
  return Object.assign(f, { proj, path: d3.geoPath(proj) });
}

function tableBody(tb, id, key, cols) {
  const rows = okRows(id);
  tb.replaceChildren();
  if (!rows) return;
  rows.forEach((r) => {
    const tr = tb.insertRow();
    tr.dataset.key = encodeURIComponent(r[key]);
    cols.forEach((c) => {
      const td = tr.insertCell();
      if (c.num) td.className = 'fr-num';
      if (c.pill) { const s = document.createElement('span'); s.className = 'fr-pill ' + c.pill(r[c.f]); s.textContent = r[c.f]; td.append(s); } else td.textContent = c.num ? num(r[c.f]) : r[c.f];
    });
  });
}

dash.calc('horizon_counts', {
  inputs: ['measures'],
  title: 'Government measures by time horizon',
  description: 'Counts the measures in each horizon class of the government response table.',
  fn: (measures) => ['Short term', 'Deferral', 'Long term, partial', 'Long term', 'Long term, blocked'].map((horizon) => ({ horizon, measures: measures.filter((m) => m.horizon === horizon).length })),
});
dash.calc('horizon_summary', {
  inputs: ['measures'],
  title: 'Short-term share of the government response',
  description: 'How many measures are short-term relief or postponements, how many are lasting but partial, and the total.',
  fn: (measures) => [{
    id: 'all',
    short_or_deferred: measures.filter((m) => m.horizon === 'Short term' || m.horizon === 'Deferral').length,
    partial: measures.filter((m) => m.horizon === 'Long term, partial').length,
    total: measures.length,
  }],
});

dash.draw('v', (el) => {
  const rows = okRows(el.dataset.source);
  let r = null;
  if (rows) {
    if (el.dataset.row != null) r = rows[+el.dataset.row];
    else { const i = el.dataset.where.indexOf('='); const k = el.dataset.where.slice(0, i), v = decodeURIComponent(el.dataset.where.slice(i + 1)); r = rows.find((d) => String(d[k]) === v); }
  }
  const v = r ? r[el.dataset.field] : null;
  el.textContent = v == null ? '—' : typeof v === 'number' ? num(v, el.dataset.dp) : v;
});

dash.draw('c-protest-days', (el) => {
  if (waiting(el, ['protest_days'])) return;
  vbars(el, { rows: okRows('protest_days'), cat: 'day', h: 280, aria: 'Marchers on each national protest day, Interior Ministry count against organisers count, in thousands',
    series: [{ key: 'interior_thousand', label: 'Interior Ministry' }, { key: 'organisers_thousand', label: 'Organisers' }], unit: ' thousand', extra: (r) => [r.note] });
});

dash.draw('c-protest-map', (el) => {
  if (waiting(el, ['protest_cities'])) return;
  const rows = okRows('protest_cities');
  const { svg, w, proj, path, show, hide } = mapBase(el, 'Map of France with 5 November turnout in seven cities, police count against union count');
  svg.append('g').selectAll('path').data(window.FR_GEO.features).join('path').attr('d', path).attr('fill', 'var(--color-panel)').attr('stroke', 'var(--cds-chart-axis)');
  const r = d3.scaleSqrt().domain([0, 350000]).range([0, Math.min(44, w * 0.1)]);
  const pts = rows.map((d) => Object.assign({ p: proj([d.lon, d.lat]) }, d)).sort((a, b) => (b.unions || 0) - (a.unions || 0));
  const lines = (d) => [d.city, 'Police: ' + (d.police == null ? 'no count published' : num(d.police)), 'Unions: ' + (d.unions == null ? 'no count published' : num(d.unions))];
  hover(svg.append('g').selectAll('circle').data(pts.filter((d) => d.unions != null)).join('circle').attr('cx', (d) => d.p[0]).attr('cy', (d) => d.p[1]).attr('r', (d) => r(d.unions))
    .style('fill', C[1]).attr('fill-opacity', 0.22).style('stroke', C[1]).attr('stroke-width', 1.5), show, hide, lines);
  hover(svg.append('g').selectAll('circle').data(pts.filter((d) => d.police != null)).join('circle').attr('cx', (d) => d.p[0]).attr('cy', (d) => d.p[1]).attr('r', (d) => Math.max(3, r(d.police)))
    .style('fill', C[0]), show, hide, lines);
  svg.append('g').selectAll('text').data(pts).join('text').attr('class', 'fr-val fr-halo').attr('text-anchor', 'middle').attr('x', (d) => d.p[0]).attr('y', (d) => (d.unions == null ? d.p[1] + Math.max(r(d.police), 3) + 14 : d.p[1] - Math.max(r(d.police || 0), 5) - 5)).text((d) => d.city);
});

dash.draw('t-cities', (tb) => tableBody(tb, 'protest_cities', 'city', [{ f: 'city' }, { f: 'police', num: 1 }, { f: 'unions', num: 1 }]));

dash.draw('c-unions', (el) => {
  if (waiting(el, ['unions'])) return;
  hbars(el, { rows: okRows('unions'), cat: 'union', key: 'audience_2025', unit: '%', dp: 2, aria: 'Share of workplace election votes won by each union confederation in the 2025 measurement', extra: (d) => [d.position] });
});
dash.draw('c-strike', (el) => {
  if (waiting(el, ['strike_rates'])) return;
  hbars(el, { rows: okRows('strike_rates'), cat: 'sector', key: 'rate', unit: '%', aria: 'Share of public-sector staff on strike on 5 November by sector', extra: (d) => ['Counted by: ' + d.counted_by] });
});

dash.draw('c-unemp', (el) => {
  if (waiting(el, ['unemployment'])) return;
  lineChart(el, { rows: okRows('unemployment'), x: 'date', name: 'quarter', unit: '%', dp: 1, aria: 'Quarterly unemployment rate in France from 2015 to the third quarter of 2026',
    series: [{ key: 'rate', label: 'All ages 15 and over' }, { key: 'rate_25_49', label: 'Ages 25 to 49' }] });
});
dash.draw('c-unemp-groups', (el) => {
  if (waiting(el, ['unemployment_groups'])) return;
  hbars(el, { rows: okRows('unemployment_groups'), cat: 'group', key: 'rate', unit: '%', dp: 1, aria: 'Unemployment rate by age group and sex in the third quarter of 2026',
    soft: (d) => d.group !== 'Ages 15-24', extra: (d) => ['Change over one year: ' + (d.change_1y > 0 ? '+' : '') + num(d.change_1y, 1) + ' points'] });
});
dash.draw('c-unemp-map', (el) => {
  if (waiting(el, ['unemployment_regions'])) return;
  const by = new Map(okRows('unemployment_regions').map((d) => [d.code, d]));
  const { svg, path, show, hide } = mapBase(el, 'Map of unemployment rates by region in mainland France, second quarter of 2026');
  const ext = d3.extent(window.FR_GEO.features, (f) => by.get(f.properties.code).rate);
  const op = d3.scaleLinear().domain(ext).range([0.12, 0.95]);
  hover(svg.append('g').selectAll('path').data(window.FR_GEO.features).join('path').attr('d', path).style('fill', C[0]).attr('fill-opacity', (f) => op(by.get(f.properties.code).rate)).attr('stroke', 'var(--color-bg)').attr('stroke-width', 1),
    show, hide, (f) => { const d = by.get(f.properties.code); return [d.region, 'Unemployment: ' + num(d.rate, 1) + '%', 'Change over one year: ' + (d.change_1y > 0 ? '+' : '') + num(d.change_1y, 1) + ' points']; });
  svg.append('g').style('pointer-events', 'none').selectAll('text').data(window.FR_GEO.features).join('text').attr('class', 'fr-val fr-halo').attr('text-anchor', 'middle')
    .attr('x', (f) => path.centroid(f)[0]).attr('y', (f) => path.centroid(f)[1]).attr('dy', '0.32em').text((f) => num(by.get(f.properties.code).rate, 1));
});

dash.draw('c-gdp', (el) => {
  if (waiting(el, ['gdp'])) return;
  vbars(el, { rows: okRows('gdp'), cat: 'quarter', h: 250, unit: '%', dp: 1, aria: 'Quarterly GDP growth in France from 2022 to the third quarter of 2026',
    series: [{ key: 'growth', label: 'GDP growth on previous quarter' }], color: (d) => (d.v < 0 ? BAD : C[0]), catFmt: (c) => (c.endsWith('Q1') ? c.slice(0, 4) : ''),
    extra: (r) => ['Consumption: ' + num(r.consumption, 2) + ' pts', 'Investment: ' + num(r.investment, 2) + ' pts', 'Net trade: ' + num(r.net_trade, 2) + ' pts', 'Inventories: ' + num(r.inventories, 2) + ' pts'] });
});

dash.draw('c-cpi', (el) => {
  if (waiting(el, ['inflation'])) return;
  lineChart(el, { rows: okRows('inflation'), x: 'date', name: 'month', unit: '%', dp: 1, y0: 0, aria: 'Consumer price inflation in France, year on year, monthly from 2021 to October 2026', series: [{ key: 'cpi_yoy', label: 'Consumer prices, year on year' }] });
});
dash.draw('c-cpi-parts', (el) => {
  if (waiting(el, ['inflation_components'])) return;
  hbars(el, { rows: okRows('inflation_components'), cat: 'component', key: 'oct_2026', unit: '%', dp: 1, aria: 'Year-on-year price change by category in October 2026',
    soft: (d) => d.component !== 'Energy' && d.component !== 'Fresh food', extra: (d) => ['October 2025: ' + num(d.oct_2025, 1) + '%'] });
});

dash.draw('c-deficit', (el) => {
  if (waiting(el, ['public_finances'])) return;
  vbars(el, { rows: okRows('public_finances'), cat: 'year', h: 220, unit: '% of GDP', dp: 1, aria: 'Public deficit as a share of GDP, 2022 to 2027', series: [{ key: 'deficit', label: 'Deficit' }], soft: (r) => r.status !== 'actual', extra: (r) => [r.status] });
});
dash.draw('c-debt', (el) => {
  if (waiting(el, ['public_finances'])) return;
  vbars(el, { rows: okRows('public_finances'), cat: 'year', h: 220, unit: '% of GDP', dp: 1, aria: 'Public debt as a share of GDP, 2022 to 2027', series: [{ key: 'debt', label: 'Debt' }], soft: (r) => r.status !== 'actual', extra: (r) => [r.status] });
});
dash.draw('c-spread', (el) => {
  if (waiting(el, ['bond_spread'])) return;
  hbars(el, { rows: okRows('bond_spread'), cat: 'period', key: 'spread_bp', unit: ' bp', aria: 'Gap between French and German 10-year government bond yields, in basis points', color: (d) => (d.kind === 'annual average' ? C[0] : BAD),
    extra: (d) => [d.kind].concat(d.oat_yield == null ? [] : ['French 10-year yield: ' + num(d.oat_yield, 2) + '%', 'German 10-year yield: ' + num(d.bund_yield, 2) + '%']) });
});

dash.draw('c-class', (el) => {
  if (waiting(el, ['class_size'])) return;
  vbars(el, { rows: okRows('class_size'), cat: 'label', h: 250, twoLine: true, unit: ' pupils', aria: 'Average class size in France against the OECD average, primary and lower secondary, 2015 and 2024', series: [{ key: 'france', label: 'France' }, { key: 'oecd', label: 'OECD average' }] });
});

dash.draw('c-trust', (el) => {
  if (waiting(el, ['trust'])) return;
  lineChart(el, { rows: okRows('trust'), x: 'date', name: 'month', unit: '%', y0: 0, aria: 'Share of French adults who trust President Macron, monthly Elabe barometer from May 2017 to November 2026', series: [{ key: 'trust', label: 'Trust the president' }] });
});

const pill = (h) => (h === 'Long term' ? 'ok' : h === 'Short term' ? 'warn' : h === 'Long term, partial' ? 'part' : 'bad');
dash.draw('t-measures', (tb) => tableBody(tb, 'measures', 'id', [{ f: 'date' }, { f: 'area' }, { f: 'measure' }, { f: 'horizon', pill }, { f: 'why' }]));
dash.draw('c-horizon', (el) => {
  if (waiting(el, ['horizon_counts'])) return;
  const col = { ok: 'var(--color-ok)', warn: 'var(--color-warn)', bad: BAD, part: 'var(--cds-chart-muted)' };
  hbars(el, { rows: okRows('horizon_counts'), cat: 'horizon', key: 'measures', aria: 'Number of government measures in each time-horizon class', color: (d) => col[pill(d.horizon)] });
});

document.querySelectorAll('#dash-root [data-c]').forEach((e) => { e.style.background = C[+e.dataset.c]; });

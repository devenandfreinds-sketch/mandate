-- Retires three Greater Manchester rows replaced by the October 2026 GM sweep (approved 2026-10-11).
-- Each sits on a calendar-year period that the replacement uk_fiscal_year series does not overwrite:
--   transit_ridership 2024 (Metrolink-only, 45.6m)      -> DfT BUS01e bus journeys, FY2015-16..FY2024-25
--   transit_reliability 2025 (TfGM, one month, 75.8)    -> DfT BUS09a, FY2015-16..FY2024-25
--   median_rent 2026 (Manchester district PIPR, 1352)   -> ONS/VOA PRMS Table 2.7 GM median, FY2015-16..FY2022-23
-- The other three replacements (emergency_response_minutes, labor_force_participation, apprenticeships)
-- overwrite the old rows in place on import. Run AFTER importing the replacement CSVs, then reseed once.
-- Matches on slug, period AND old value, so it is a no-op if run twice or against unexpected data.
BEGIN;
DELETE FROM "MetricValue" mv
USING "Jurisdiction" j, "MetricDefinition" d
WHERE mv."jurisdictionId" = j.id AND mv."metricDefinitionId" = d.id
  AND j.slug = 'greater-manchester' AND mv."periodType" = 'year'
  AND (
    (d.slug = 'transit_ridership'   AND mv."periodLabel" = '2024' AND mv.value = 45600000)
 OR (d.slug = 'transit_reliability' AND mv."periodLabel" = '2025' AND mv.value = 75.8)
 OR (d.slug = 'median_rent'         AND mv."periodLabel" = '2026' AND mv.value = 1352)
  )
RETURNING d.slug, mv."periodLabel", mv.value;
COMMIT;

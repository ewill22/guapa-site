# Refresh all coffee roaster data sources.
# Runs the Wikidata SPARQL pull and the OSM Overpass pull in sequence.
#
# Expected cadence: monthly. Backend team (guapa-data) will eventually
# own the schedule.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== Refreshing coffee roaster data ==="
& (Join-Path $scriptDir 'fetch-wikidata.ps1')
Write-Host ""
& (Join-Path $scriptDir 'fetch-osm.ps1')
Write-Host ""
Write-Host "=== Done ==="
Write-Host "Composed dataset in src/data/coffee-roasters.js picks up the refreshed files on next build."

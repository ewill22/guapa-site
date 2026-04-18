# Refresh coffee harvest data from USDA FAS PSD
# Output: src/data/coffee-harvest.js
#
# Run from anywhere; the script resolves its own directory.
# Intended to be run periodically (monthly) to pick up USDA revisions.
# Backend team (guapa-data) will eventually run this on a schedule.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\..')
$workDir = Join-Path $scriptDir '.work'
$zipPath = Join-Path $workDir 'psd_coffee_csv.zip'
$csvPath = Join-Path $workDir 'psd_coffee.csv'
$jsonPath = Join-Path $workDir 'harvest-by-country.json'
$outPath = Join-Path $repoRoot 'src\data\coffee-harvest.js'

New-Item -ItemType Directory -Force -Path $workDir | Out-Null

Write-Host "[1/3] Fetching USDA PSD coffee dataset..."
Invoke-WebRequest -Uri 'https://apps.fas.usda.gov/psdonline/downloads/psd_coffee_csv.zip' -OutFile $zipPath -UseBasicParsing
Expand-Archive -Path $zipPath -DestinationPath $workDir -Force

Write-Host "[2/3] Aggregating country x year production (attr 028)..."
$rows = Import-Csv $csvPath | Where-Object { $_.Attribute_ID -eq '028' }

$byCountryYear = @{}
foreach ($r in $rows) {
    $c = $r.Country_Name
    $y = [int]$r.Market_Year
    $m = [int]$r.Month
    $v = [double]$r.Value
    $key = "$c|$y"
    if (-not $byCountryYear.ContainsKey($key) -or $byCountryYear[$key].Month -lt $m) {
        $byCountryYear[$key] = @{ Country = $c; Year = $y; Month = $m; Value = $v }
    }
}

$byCountry = @{}
foreach ($rec in $byCountryYear.Values) {
    if (-not $byCountry.ContainsKey($rec.Country)) { $byCountry[$rec.Country] = @{} }
    $byCountry[$rec.Country][$rec.Year.ToString()] = [math]::Round($rec.Value / 1000, 2)
}

$peak = @{}
foreach ($c in $byCountry.Keys) {
    $peak[$c] = ($byCountry[$c].Values | Measure-Object -Maximum).Maximum
}

$significant = $peak.GetEnumerator() | Where-Object { $_.Value -ge 1 } | Sort-Object -Property Value -Descending
$out = @{}
foreach ($entry in $significant) { $out[$entry.Key] = $byCountry[$entry.Key] }
$out | ConvertTo-Json -Depth 5 | Set-Content $jsonPath -Encoding UTF8
Write-Host "  $($out.Keys.Count) significant producers (peak >= 1M bags)"

Write-Host "[3/3] Emitting coffee-harvest.js..."

$regionMap = [ordered]@{
    'Brazil' = 'South America'; 'Colombia' = 'South America'; 'Peru' = 'South America'
    'Ecuador' = 'South America'; 'Venezuela' = 'South America'
    'Honduras' = 'Central America'; 'Mexico' = 'Central America'; 'Guatemala' = 'Central America'
    'El Salvador' = 'Central America'; 'Nicaragua' = 'Central America'; 'Costa Rica' = 'Central America'
    'Dominican Republic' = 'Central America'
    'Ethiopia' = 'Africa'; 'Uganda' = 'Africa'; "Cote d'Ivoire" = 'Africa'; 'Angola' = 'Africa'
    'Cameroon' = 'Africa'; 'Kenya' = 'Africa'; 'Congo (Kinshasa)' = 'Africa'; 'Tanzania' = 'Africa'
    'Madagascar' = 'Africa'
    'Vietnam' = 'Asia/Pacific'; 'Indonesia' = 'Asia/Pacific'; 'India' = 'Asia/Pacific'
    'Malaysia' = 'Asia/Pacific'; 'China' = 'Asia/Pacific'; 'Thailand' = 'Asia/Pacific'
    'Papua New Guinea' = 'Asia/Pacific'; 'Philippines' = 'Asia/Pacific'
}

$harvest = Get-Content $jsonPath -Raw | ConvertFrom-Json

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('// Coffee harvest data - country x year production in millions of 60kg bags')
[void]$sb.AppendLine('// Source: USDA FAS PSD (Production, Supply & Distribution database)')
[void]$sb.AppendLine('// License: U.S. Public Domain (OPEN Government Data Act)')
[void]$sb.AppendLine('// Auto-generated - do not hand-edit; regenerate via scripts/coffee-harvest/refresh.ps1')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('export const COFFEE_DATA_SOURCE = {')
[void]$sb.AppendLine("  name: 'USDA FAS PSD',")
[void]$sb.AppendLine("  url: 'https://apps.fas.usda.gov/psdonline/',")
[void]$sb.AppendLine("  license: 'U.S. Public Domain',")
[void]$sb.AppendLine("  attribution: 'Source: USDA FAS Production, Supply & Distribution',")
[void]$sb.AppendLine("  downloadUrl: 'https://apps.fas.usda.gov/psdonline/downloads/psd_coffee_csv.zip',")
[void]$sb.AppendLine("  fetchedOn: '$(Get-Date -Format 'yyyy-MM-dd')',")
[void]$sb.AppendLine('};')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('// Country -> region assignment + year series in millions of 60kg bags')
[void]$sb.AppendLine('export const COFFEE_PRODUCERS = {')

$countriesInHarvest = $harvest.PSObject.Properties.Name
$ordered = $regionMap.Keys | Where-Object { $countriesInHarvest -contains $_ }

foreach ($country in $ordered) {
    $years = $harvest.$country.PSObject.Properties | Sort-Object { [int]$_.Name }
    $region = $regionMap[$country]
    $peakVal = ($years | Measure-Object -Property Value -Maximum).Maximum
    $latestYearProp = $years | Select-Object -Last 1
    $latestYear = [int]$latestYearProp.Name
    $latestVal = $latestYearProp.Value
    [void]$sb.AppendLine("  ""$country"": {")
    [void]$sb.AppendLine("    region: '$region',")
    [void]$sb.AppendLine("    peak: $peakVal,")
    [void]$sb.AppendLine("    latest: { year: $latestYear, bags: $latestVal },")
    [void]$sb.Append('    production: {')
    $parts = @()
    foreach ($y in $years) { $parts += "$($y.Name): $($y.Value)" }
    [void]$sb.Append(($parts -join ', '))
    [void]$sb.AppendLine(' },')
    [void]$sb.AppendLine('  },')
}
[void]$sb.AppendLine('};')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('// Region metadata - order, display name, accent color (matches coffee-timeline.js palette)')
[void]$sb.AppendLine('export const COFFEE_REGIONS = [')
[void]$sb.AppendLine("  { key: 'south-america',   name: 'South America',   color: '#7ec89b' },")
[void]$sb.AppendLine("  { key: 'central-america', name: 'Central America', color: '#88a8d4' },")
[void]$sb.AppendLine("  { key: 'africa',          name: 'Africa',          color: '#e8a0b0' },")
[void]$sb.AppendLine("  { key: 'asia-pacific',    name: 'Asia/Pacific',    color: '#c89b6a' },")
[void]$sb.AppendLine('];')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('export function regionTotal(regionName, year) {')
[void]$sb.AppendLine('  let total = 0;')
[void]$sb.AppendLine('  for (const data of Object.values(COFFEE_PRODUCERS)) {')
[void]$sb.AppendLine('    if (data.region !== regionName) continue;')
[void]$sb.AppendLine('    const v = data.production[year];')
[void]$sb.AppendLine('    if (typeof v === "number") total += v;')
[void]$sb.AppendLine('  }')
[void]$sb.AppendLine('  return Math.round(total * 100) / 100;')
[void]$sb.AppendLine('}')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('export function globalTotal(year) {')
[void]$sb.AppendLine('  let total = 0;')
[void]$sb.AppendLine('  for (const data of Object.values(COFFEE_PRODUCERS)) {')
[void]$sb.AppendLine('    const v = data.production[year];')
[void]$sb.AppendLine('    if (typeof v === "number") total += v;')
[void]$sb.AppendLine('  }')
[void]$sb.AppendLine('  return Math.round(total * 100) / 100;')
[void]$sb.AppendLine('}')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('export function countriesInRegion(regionName, year = null) {')
[void]$sb.AppendLine('  const out = [];')
[void]$sb.AppendLine('  for (const [country, data] of Object.entries(COFFEE_PRODUCERS)) {')
[void]$sb.AppendLine('    if (data.region !== regionName) continue;')
[void]$sb.AppendLine('    if (year !== null) {')
[void]$sb.AppendLine('      const v = data.production[year];')
[void]$sb.AppendLine('      if (typeof v !== "number" || v <= 0) continue;')
[void]$sb.AppendLine('      out.push({ country, bags: v });')
[void]$sb.AppendLine('    } else {')
[void]$sb.AppendLine('      out.push({ country, bags: data.latest.bags });')
[void]$sb.AppendLine('    }')
[void]$sb.AppendLine('  }')
[void]$sb.AppendLine('  return out.sort((a, b) => b.bags - a.bags);')
[void]$sb.AppendLine('}')

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outPath, $sb.ToString(), $utf8NoBom)
Write-Host "`nWrote $outPath ($($sb.Length) chars, $($ordered.Count) countries)"

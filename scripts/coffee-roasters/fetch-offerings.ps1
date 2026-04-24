# Fetch current coffee offerings from each known Shopify-hosted roaster.
# Output: src/data/coffee-offerings.js (auto-generated)
#
# Every specialty roaster whose storefront runs on Shopify exposes a public
# /products.json endpoint with titles, handles, vendor, body_html, and tags.
# We normalise those into a flat list of { roasterSlug, title, url, country,
# summary } records and wire them into the Today's Journey blurb + the
# roaster card below.
#
# Attribution: every record links back to the roaster's own product page.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\..')
$outPath = Join-Path $repoRoot 'src\data\coffee-offerings.js'

# Roasters confirmed on Shopify with /products.json. Expand as we verify more.
$roasters = @(
    @{ slug = 'panther-coffee';         name = 'Panther Coffee';         base = 'https://panthercoffee.com' },
    @{ slug = 'onyx-coffee-lab';        name = 'Onyx Coffee Lab';        base = 'https://onyxcoffeelab.com' },
    @{ slug = 'heart-coffee-roasters';  name = 'Heart Coffee Roasters';  base = 'https://www.heartroasters.com' },
    @{ slug = 'la-cabra';               name = 'La Cabra';               base = 'https://lacabra.com' },
    @{ slug = 'coffee-collective';      name = 'The Coffee Collective';  base = 'https://coffeecollective.dk' },
    @{ slug = 'tim-wendelboe';          name = 'Tim Wendelboe';          base = 'https://www.timwendelboe.no' },
    @{ slug = 'drop-coffee';            name = 'Drop Coffee';            base = 'https://www.dropcoffee.com' },
    @{ slug = 'stumptown';              name = 'Stumptown';              base = 'https://www.stumptowncoffee.com' },
    @{ slug = 'george-howell-coffee';   name = 'George Howell';          base = 'https://www.georgehowellcoffee.com' },
    @{ slug = 'april-coffee';           name = 'April Coffee';           base = 'https://aprilcoffeeroasters.com' },
    @{ slug = 'passenger-coffee';       name = 'Passenger Coffee';       base = 'https://passengercoffee.com' },
    @{ slug = 'sey-coffee';              name = 'Sey Coffee';              base = 'https://seycoffee.com' },
    @{ slug = 'proud-mary';              name = 'Proud Mary';              base = 'https://proudmarycoffee.com' },
    @{ slug = 'black-and-white';         name = 'Black & White Coffee';    base = 'https://blackwhiteroasters.com' },
    @{ slug = 'prolog-coffee';           name = 'Prolog Coffee';           base = 'https://prologcoffee.com' },
    @{ slug = 'verve-coffee';            name = 'Verve Coffee Roasters';   base = 'https://www.vervecoffee.com' },
    @{ slug = 'ruby-coffee';             name = 'Ruby Coffee Roasters';    base = 'https://rubycoffeeroasters.com' },
    @{ slug = 'sweet-bloom';             name = 'Sweet Bloom Coffee';      base = 'https://sweetbloomcoffee.com' },
    @{ slug = 'corvus-coffee';           name = 'Corvus Coffee';           base = 'https://corvuscoffee.com' },
    @{ slug = 'parlor-coffee';           name = 'Parlor Coffee';           base = 'https://parlorcoffee.com' },
    @{ slug = 'pilot-coffee';            name = 'Pilot Coffee Roasters';   base = 'https://pilotcoffeeroasters.com' },
    @{ slug = '49th-parallel';           name = '49th Parallel Coffee';    base = 'https://49thcoffee.com' },
    @{ slug = 'cat-and-cloud';           name = 'Cat & Cloud';             base = 'https://catandcloud.com' },
    @{ slug = 'roseline-coffee';         name = 'Roseline Coffee';         base = 'https://roselinecoffee.com' },
    @{ slug = 'methodical-coffee';       name = 'Methodical Coffee';       base = 'https://methodicalcoffee.com' }
)

# Countries we recognise in titles/body text. Sumatra/Java normalise to
# Indonesia so grid filtering works.
$countries = @(
    'Colombia','Ethiopia','Kenya','Brazil','Guatemala','Panama','Costa Rica',
    'Honduras','Burundi','Rwanda','Nicaragua','Peru','Ecuador','Uganda',
    'Indonesia','Sumatra','Java','Sulawesi','Bali','Yemen','Jamaica','Bolivia',
    'El Salvador','Mexico','Dominican Republic','Tanzania','Zambia','India',
    'Thailand','Vietnam','Myanmar','Laos','Papua New Guinea','Timor-Leste',
    'Haiti','Hawaii','Taiwan','China','Congo'
)

function StripHtml($html) {
    if (-not $html) { return '' }
    $t = $html -replace '<[^>]+>', ' '
    $t = $t -replace '&nbsp;', ' '
    $t = $t -replace '&amp;', '&'
    $t = $t -replace '&#39;', "'"
    $t = $t -replace '&quot;', '"'
    $t = $t -replace '&mdash;', '--'
    $t = $t -replace '&ndash;', '-'
    $t = $t -replace '\s+', ' '
    return $t.Trim()
}

function InferProcess($text) {
    if (-not $text) { return $null }
    $t = $text.ToLower()
    # Order matters: most specific first so "anaerobic natural" wins over "natural".
    if ($t -match 'thermal[- ]shock|thermic shock') { return 'thermal-shock' }
    if ($t -match 'carbonic maceration|carbonic macer') { return 'carbonic' }
    if ($t -match 'anaerobic|anaerobically') { return 'anaerobic' }
    if ($t -match 'wet[- ]hull|giling basah') { return 'wet-hulled' }
    if ($t -match '\b(white|yellow|red|black)? ?honey\b|honey process|miel process|semi[- ]washed|semi washed|pulped natural') { return 'honey' }
    if ($t -match '\bwashed\b|fully washed|wet process') { return 'washed' }
    if ($t -match '\bnatural\b|dry process|sun[- ]dried') { return 'natural' }
    return $null
}

function InferCountry($text) {
    if (-not $text) { return $null }
    foreach ($c in $countries) {
        $pattern = '\b' + [regex]::Escape($c) + '\b'
        if ([regex]::IsMatch($text, $pattern)) {
            switch ($c) {
                'Sumatra'  { return 'Indonesia' }
                'Java'     { return 'Indonesia' }
                'Sulawesi' { return 'Indonesia' }
                'Bali'     { return 'Indonesia' }
                'Hawaii'   { return 'United States' }
                'Congo'    { return 'Congo, Democratic Republic of the' }
                default    { return $c }
            }
        }
    }
    return $null
}

# Heuristic: does this product look like a bag of coffee (not merch/equipment)?
function IsCoffee($p) {
    $pt = "$($p.product_type)".ToLower()
    if ($pt -match 'merch|mug|apparel|equipment|brewer|grinder|accessor|filter|book|glass|gift card') { return $false }
    if ($pt -match 'coffee|bean|whole|espresso|blend|roast|single') { return $true }
    # No product_type — fall back on tags + title inspection
    $tagStr = ("$($p.tags)").ToLower()
    if ($tagStr -match 'coffee|bean|espresso|blend|single|origin') { return $true }
    $title = "$($p.title)".ToLower()
    if ($title -match 'mug|shirt|hoodie|bag(?! of)|grinder|brewer|kit|subscription gift') { return $false }
    # If body mentions tasting notes or a farm/variety, it's almost certainly coffee
    $body = "$($p.body_html)".ToLower()
    if ($body -match 'tasting notes|varietal|variety|process|washed|natural|anaerobic|honey process|elevation|m\.a\.s\.l|masl|altitude|farm|producer|roast level') { return $true }
    return $false
}

$allOfferings = @()

foreach ($r in $roasters) {
    Write-Host "Fetching $($r.name) ($($r.base))..."
    $url = "$($r.base)/products.json?limit=100"
    $headers = @{ 'User-Agent' = 'GuapaDataBot/1.0 (https://guapa.space; eewilliamsremote@gmail.com)' }
    try {
        $raw = Invoke-WebRequest -Uri $url -Headers $headers -TimeoutSec 60 -UseBasicParsing
        $json = [System.Text.Encoding]::UTF8.GetString($raw.RawContentStream.ToArray())
        $data = $json | ConvertFrom-Json
    } catch {
        Write-Host "  Failed: $($_.Exception.Message)"
        continue
    }
    if (-not $data.products) {
        Write-Host "  No products field (not Shopify or blocked)"
        continue
    }

    $count = 0
    foreach ($p in $data.products) {
        if (-not (IsCoffee $p)) { continue }
        $body = StripHtml $p.body_html
        $country = InferCountry $p.title
        if (-not $country) { $country = InferCountry $body }
        $process = InferProcess $p.title
        if (-not $process) { $process = InferProcess $body }
        if ($body.Length -gt 240) {
            $summary = $body.Substring(0, 240).TrimEnd() + '...'
        } else {
            $summary = $body
        }
        $allOfferings += [ordered]@{
            roasterSlug = $r.slug
            roasterName = $r.name
            title       = "$($p.title)"
            handle      = "$($p.handle)"
            url         = "$($r.base)/products/$($p.handle)"
            country     = $country
            process     = $process
            summary     = $summary
        }
        $count++
    }
    Write-Host "  $count coffee offerings"
}

Write-Host ""
Write-Host "Total: $($allOfferings.Count) offerings across $($roasters.Count) roasters"

function EscJs($s) {
    if ($null -eq $s -or $s -eq '') { return 'null' }
    $esc = $s -replace '\\', '\\\\' -replace "'", "\'"
    return "'$esc'"
}

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('// coffee-offerings.js - auto-generated by scripts/coffee-roasters/fetch-offerings.ps1')
[void]$sb.AppendLine('// Source: each roaster Shopify storefront /products.json (public).')
[void]$sb.AppendLine('// Each offering links back to the roaster''s own product page.')
[void]$sb.AppendLine('// Do not hand-edit - regenerate to refresh.')
[void]$sb.AppendLine('')
[void]$sb.AppendLine("export const OFFERINGS_FETCHED_ON = '$(Get-Date -Format 'yyyy-MM-dd')';")
[void]$sb.AppendLine('')
[void]$sb.AppendLine('// { roasterSlug, roasterName, title, handle, url, country, process, summary }')
[void]$sb.AppendLine('export const ROASTER_OFFERINGS = [')
foreach ($o in $allOfferings) {
    [void]$sb.AppendLine('  {')
    [void]$sb.AppendLine("    roasterSlug: $(EscJs $o.roasterSlug),")
    [void]$sb.AppendLine("    roasterName: $(EscJs $o.roasterName),")
    [void]$sb.AppendLine("    title: $(EscJs $o.title),")
    [void]$sb.AppendLine("    handle: $(EscJs $o.handle),")
    [void]$sb.AppendLine("    url: $(EscJs $o.url),")
    [void]$sb.AppendLine("    country: $(EscJs $o.country),")
    [void]$sb.AppendLine("    process: $(EscJs $o.process),")
    [void]$sb.AppendLine("    summary: $(EscJs $o.summary),")
    [void]$sb.AppendLine('  },')
}
[void]$sb.AppendLine('];')

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outPath, $sb.ToString(), $utf8NoBom)

Write-Host ""
Write-Host "Wrote $outPath"
Write-Host "  with country inferred: $(($allOfferings | Where-Object { $_.country }).Count) of $($allOfferings.Count)"
Write-Host "  with process inferred: $(($allOfferings | Where-Object { $_.process }).Count) of $($allOfferings.Count)"

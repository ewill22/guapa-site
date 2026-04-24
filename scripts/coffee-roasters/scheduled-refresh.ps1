# scheduled-refresh.ps1
# The cron-style wrapper. Runs fetch-offerings.ps1, diffs the result, and
# auto-commits/pushes if anything changed. Idempotent - safe to run hourly
# or daily; no-op if Shopify returned identical output.
#
# Designed for:
#   - Windows Task Scheduler (local, via install-scheduler-task.ps1)
#   - Linux cron via pwsh (when backend takes over)
#
# Exit codes: 0 = success (changes or no-op), 1 = fetch failed, 2 = git failed.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\..')
Set-Location $repoRoot

$logDir = Join-Path $scriptDir '.logs'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir "refresh-$(Get-Date -Format 'yyyy-MM').log"

function Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

Log "=== refresh start (pid $PID) ==="

$fetchScript = Join-Path $scriptDir 'fetch-offerings.ps1'
try {
    $fetchOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $fetchScript 2>&1 | Out-String
    Add-Content -Path $logFile -Value $fetchOutput -Encoding utf8
} catch {
    Log "fetch-offerings.ps1 threw: $($_.Exception.Message)"
    exit 1
}

# Ask git if the output file changed. If not, bail cleanly.
$status = git status --porcelain src/data/coffee-offerings.js
if (-not $status) {
    Log "no changes to coffee-offerings.js - nothing to commit"
    Log "=== refresh done (no-op) ==="
    exit 0
}

Log "changes detected, committing"
try {
    git add src/data/coffee-offerings.js
    git commit -m "Refresh coffee offerings [auto]" 2>&1 | Out-String | ForEach-Object { Add-Content -Path $logFile -Value $_ -Encoding utf8 }
    # Rebase in case backend pushed music-catalog updates while we were fetching.
    git pull --rebase 2>&1 | Out-String | ForEach-Object { Add-Content -Path $logFile -Value $_ -Encoding utf8 }
    git push 2>&1 | Out-String | ForEach-Object { Add-Content -Path $logFile -Value $_ -Encoding utf8 }
} catch {
    Log "git step failed: $($_.Exception.Message)"
    exit 2
}

Log "=== refresh done (pushed) ==="
exit 0

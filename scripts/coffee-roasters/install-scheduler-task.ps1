# install-scheduler-task.ps1
# One-time installer: registers the daily coffee offerings refresh in Windows
# Task Scheduler. Idempotent - re-running updates the existing task.
#
# Runs as the current user with LogonType Interactive so git push can use the
# credential helper you already have set up for normal dev work.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$refreshScript = Join-Path $scriptDir 'scheduled-refresh.ps1'
$taskName = 'Guapa Refresh Coffee Offerings'

if (-not (Test-Path $refreshScript)) {
    throw "Cannot find $refreshScript"
}

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$refreshScript`""

# 5:15am daily - matches backend's dq_enrich cadence without colliding.
$trigger = New-ScheduledTaskTrigger -Daily -At 5:15am

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -AllowStartIfOnBatteries `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Updating existing task: $taskName"
    Set-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal | Out-Null
} else {
    Write-Host "Registering new task: $taskName"
    Register-ScheduledTask -TaskName $taskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "Daily refresh of src/data/coffee-offerings.js from 25 Shopify specialty roasters. Auto-commits [auto] and pushes when the data changes." | Out-Null
}

Write-Host ""
Write-Host "Task registered."
Write-Host "  Name     : $taskName"
Write-Host "  Schedule : Daily 5:15am"
Write-Host "  Script   : $refreshScript"
Write-Host "  Logs     : $scriptDir\.logs\refresh-YYYY-MM.log"
Write-Host ""
Write-Host "Manage it in taskschd.msc -> Task Scheduler Library."
Write-Host "To run once now: Start-ScheduledTask -TaskName '$taskName'"
Write-Host "To remove:       Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"

#!/usr/bin/env pwsh

# WARNING: Untested script. Fill free to improve it.

if ($args.Count -ne 1) {
    Write-Host "Usage: $PSCommandPath <username>"
    Write-Host "  - username: your mechanographic number (to be set as admin)"
    exit 1
}

$ROOT = Split-Path -Path (Split-Path -Path (Split-Path -Path $PSScriptRoot -Resolve) -Resolve) -Resolve
Set-Location -Path "$ROOT/django/tts_be"

$USERNAME = $args[0]

$tempSqlFile = [System.IO.Path]::GetTempFileName()
(Get-Content "$ROOT/scripts/marketplace/mock_data.sql") -replace '<username>', $USERNAME | Set-Content -Path $tempSqlFile
sqlite3 "$ROOT/django/tts_be/database.db" < $tempSqlFile
Remove-Item -Path $tempSqlFile

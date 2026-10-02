
#!/usr/bin/env pwsh

# WARNING: Untested script. Fill free to improve it.

if ($args.Count -ne 1) {
    Write-Host "Usage: $PSCommandPath <username>"
    exit 1
}

$ROOT_DIR = Split-Path -Path (Split-Path -Path (Split-Path -Path $PSScriptRoot -Resolve) -Resolve) -Resolve
Set-Location -Path "$ROOT_DIR/django/tts_be"

$USERNAME = $args[0]

sqlite3 database.db "UPDATE auth_user SET username = '$USERNAME';"

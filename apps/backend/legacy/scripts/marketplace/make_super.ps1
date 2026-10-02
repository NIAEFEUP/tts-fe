#!/usr/bin/env pwsh

# WARNING: Untested script. Feel free to improve it.
# Makes a user a superuser (admin)

if ($args.Count -ne 1) {
    Write-Host "Usage: $PSCommandPath <username>"
    exit 1
}

$ROOT_DIR = Split-Path -Path (Split-Path -Path (Split-Path -Path $PSScriptRoot -Resolve) -Resolve) -Resolve
Set-Location -Path "$ROOT_DIR/django/tts_be"

$USERNAME = $args[0]

sqlite3 database.db "UPDATE auth_user SET is_staff = 1, is_superuser = 1 WHERE username = '$USERNAME';"
Write-Host "User '$USERNAME' is now a superuser."

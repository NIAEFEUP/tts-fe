#!/usr/bin/env pwsh

# WARNING: Untested script. Feel free to improve it.
# Cleans the auth_user table by removing all users

$ROOT_DIR = Split-Path -Path (Split-Path -Path (Split-Path -Path $PSScriptRoot -Resolve) -Resolve) -Resolve
Set-Location -Path "$ROOT_DIR/django/tts_be"

Write-Host "Cleaning auth_user table..."
sqlite3 database.db "DELETE FROM auth_user;"
Write-Host "Auth table cleaned successfully."

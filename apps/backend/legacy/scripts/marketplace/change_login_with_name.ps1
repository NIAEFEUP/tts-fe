#!/usr/bin/env pwsh

# WARNING: Untested script. Feel free to improve it.

if ($args.Count -ne 2) {
    Write-Host "Usage: $PSCommandPath <username> <email>"
    exit 1
}

$ROOT_DIR = Split-Path -Path (Split-Path -Path (Split-Path -Path $PSScriptRoot -Resolve) -Resolve) -Resolve
Set-Location -Path "$ROOT_DIR/django/tts_be"

$USERNAME = $args[0]
$EMAIL = $args[1]

sqlite3 database.db "UPDATE auth_user SET username = '$USERNAME', email = '$EMAIL';"
Write-Host "Updated username to: $USERNAME and email to: $EMAIL"

#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <username>"
    exit 1
fi

ROOT_DIR="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT_DIR/django/tts_be" || { echo "Failed to change directory to $ROOT_DIR/django/tts_be"; exit 1; }

USERNAME=$1


sqlite3 database.db "UPDATE auth_user SET is_superuser = 1 WHERE email = '${USERNAME}@up.pt';"

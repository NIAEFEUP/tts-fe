#!/bin/sh

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <current_username> <target_username>"
    exit 1
fi

ROOT_DIR="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT_DIR/django/tts_be" || { echo "Failed to change directory to $ROOT_DIR/django/tts_be"; exit 1; }

CURRENT_USERNAME=$1
TARGET_USERNAME=$2

sqlite3 database.db "UPDATE auth_user SET username = '$TARGET_USERNAME' WHERE email = '${CURRENT_USERNAME}@up.pt';"

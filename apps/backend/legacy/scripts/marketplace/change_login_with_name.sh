#!/bin/sh

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <current_username> <target_username> <first_name> <last_name>"
    exit 1
fi

ROOT_DIR="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT_DIR/django/tts_be" || { echo "Failed to change directory to $ROOT_DIR/django/tts_be"; exit 1; }

CURRENT_USERNAME=$1
TARGET_USERNAME=$2
FIRST_NAME=$3
LAST_NAME=$4

sqlite3 database.db "UPDATE auth_user SET username = '$TARGET_USERNAME', first_name = '$FIRST_NAME', last_name = '$LAST_NAME' WHERE email = '${CURRENT_USERNAME}@up.pt';"

#!/bin/sh

# Caminho base
ROOT_DIR="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT_DIR/django/tts_be" || { echo "Failed to change directory to $ROOT_DIR/django/tts_be"; exit 1; }

echo "Deleting all auth users"
sqlite3 database.db "DELETE FROM auth_user;"

echo "Operação concluída."

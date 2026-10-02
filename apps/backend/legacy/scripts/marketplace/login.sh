#!/bin/sh

# Verifica se foram passados 3 argumentos
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <username> <first_name> <last_name>"
    exit 1
fi

USERNAME=$1
FIRST_NAME=$2
LAST_NAME=$3

# Caminho base
ROOT_DIR="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT_DIR/django/tts_be" || { echo "Failed to change directory to $ROOT_DIR/django/tts_be"; exit 1; }

# Verifica se existe algum utilizador
USER_COUNT=$(sqlite3 database.db "SELECT COUNT(*) FROM auth_user;")

if [ "$USER_COUNT" -eq 0 ]; then
    echo "Nenhum utilizador encontrado — criando novo utilizador '$USERNAME'..."
    sqlite3 database.db "INSERT INTO auth_user (password, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
                         VALUES ('', 0, '$USERNAME', '$FIRST_NAME', '$LAST_NAME', '', 0, 1, datetime('now'));"
else
    echo "Utilizador encontrado — atualizando para '$USERNAME'..."
    sqlite3 database.db "UPDATE auth_user 
                         SET username='$USERNAME', first_name='$FIRST_NAME', last_name='$LAST_NAME'
                         WHERE id = (SELECT id FROM auth_user LIMIT 1);"
fi

echo "Operação concluída."

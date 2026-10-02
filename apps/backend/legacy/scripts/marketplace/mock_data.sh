#!/bin/sh

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <username>"
  echo "  - username: your mechanographic number (to be set as admin)"
  exit 1
fi

ROOT="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$ROOT/django/tts_be" || { echo "Failed to change directory to $ROOT/django/tts_be"; exit 1; }

USERNAME=$1

sed "s/<username>/$USERNAME/g" $ROOT/scripts/marketplace/mock_data.sql > /tmp/mock_data.sql
sqlite3 $ROOT/django/tts_be/database.db < /tmp/mock_data.sql
rm /tmp/mock_data.sql

echo "Gerando dados de teste complexos (Python)..."
cd "$ROOT/django"
if docker ps | grep -q tts_django; then
    docker exec tts_django python manage.py generate_mock_requests
else
    python3 manage.py generate_mock_requests
fi
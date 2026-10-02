#!/bin/bash

# Waits for PostgreSQL initialization.

if [[ "${DEBUG}" == 0 ]]; then
  # Wait for PostgreSQL to be ready
  until PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" "${POSTGRES_DB}" -c 'select 1'; do
    >&2 echo "PostgreSQL is unavailable - sleeping"
    sleep 4
  done
  >&2 echo "PostgreSQL is up - executing command"
else
  >&2 echo "DEBUG mode is enabled - skipping PostgreSQL check"
fi

# Migrate the Django.
python manage.py makemigrations # default django migrations
python manage.py makemigrations university
python manage.py makemigrations exchange
python manage.py migrate university 0001_initial --fake
python manage.py migrate exchange 0001_initial --fake
python manage.py migrate admin 
python manage.py migrate auth 
python manage.py migrate sessions 
python manage.py migrate contenttypes
python manage.py runserver 0.0.0.0:8000

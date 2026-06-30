#!/bin/bash
# Creates the shadow database used by `prisma migrate dev`.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  SELECT 'CREATE DATABASE "${POSTGRES_DB}_shadow"'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}_shadow')\gexec
EOSQL

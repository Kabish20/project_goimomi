psql -d goimomi_db -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"

# 1. Kill connections
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'goimomi_db' AND pid <> pg_backend_pid();"
# 2. Re-create
psql -c "DROP DATABASE IF EXISTS goimomi_db;"
psql -c "CREATE DATABASE goimomi_db OWNER goimomi_user;"
# 3. Restore
pg_restore -d goimomi_db /home/ubuntu/goimomi_v2.dump

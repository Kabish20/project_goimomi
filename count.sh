export PGPASSWORD='Goimomi@123'
psql -U goimomi_user -h localhost goimomi_db -t -c "SELECT count(*) FROM Holidays_holidaypackage;"

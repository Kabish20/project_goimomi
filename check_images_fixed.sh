psql -d goimomi_db -t -c "SELECT header_image FROM \"Holidays_holidaypackage\" WHERE header_image IS NOT NULL LIMIT 5;"

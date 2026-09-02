#!/usr/bin/env bash
# ==============================================================================
# Goimomi Holidays - Database & Media Backup / Restore Utility
# Usage:
#   ./backup_restore.sh backup          # Create full DB & Media backup
#   ./backup_restore.sh restore <file>  # Restore database from SQL dump
# ==============================================================================

set -euo pipefail

BACKEND_DIR="/home/ubuntu/goimomi/goimomibackend"
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="goimomi_db"
DB_USER="goimomi_user"

mkdir -p "$BACKUP_DIR"

action="${1:-backup}"

case "$action" in
    backup)
        echo "💾 Starting full backup of Goimomi ($TIMESTAMP)..."
        
        # 1. PostgreSQL raw SQL dump
        echo "🗄️  Dumping PostgreSQL database: $DB_NAME..."
        pg_dump -U "$DB_USER" -h localhost -d "$DB_NAME" -F c -b -v -f "$BACKUP_DIR/goimomi_pgdump_${TIMESTAMP}.dump"
        pg_dump -U "$DB_USER" -h localhost -d "$DB_NAME" > "$BACKUP_DIR/goimomi_sql_${TIMESTAMP}.sql"
        
        # 2. Django dumpdata (Holidays JSON format)
        if [ -d "$BACKEND_DIR/venv" ]; then
            echo "📄 Creating Django JSON dumpdata..."
            source "$BACKEND_DIR/venv/bin/activate"
            python "$BACKEND_DIR/manage.py" dumpdata Holidays --indent 2 -o "$BACKUP_DIR/goimomi_data_${TIMESTAMP}.json"
        fi

        # 3. Archive media directory
        if [ -d "$BACKEND_DIR/media" ]; then
            echo "🖼️  Archiving uploaded media..."
            tar -czf "$BACKUP_DIR/goimomi_media_${TIMESTAMP}.tar.gz" -C "$BACKEND_DIR" media
        fi

        # Keep latest copy pointers
        cp "$BACKUP_DIR/goimomi_pgdump_${TIMESTAMP}.dump" "$BACKUP_DIR/latest_pgdump.dump"
        if [ -f "$BACKUP_DIR/goimomi_media_${TIMESTAMP}.tar.gz" ]; then
            cp "$BACKUP_DIR/goimomi_media_${TIMESTAMP}.tar.gz" "$BACKUP_DIR/latest_media.tar.gz"
        fi

        echo "✅ Backup successfully saved in $BACKUP_DIR"
        ;;

    restore)
        DUMP_FILE="${2:-}"
        if [ -z "$DUMP_FILE" ]; then
            if [ -f "$BACKUP_DIR/latest_pgdump.dump" ]; then
                DUMP_FILE="$BACKUP_DIR/latest_pgdump.dump"
            else
                echo "❌ Please provide a dump file to restore: ./backup_restore.sh restore /path/to/dump"
                exit 1
            fi
        fi

        echo "⚠️  Restoring database $DB_NAME from $DUMP_FILE..."
        
        # Stop backend during restore
        sudo systemctl stop goimomi || true
        
        if [[ "$DUMP_FILE" == *.dump ]]; then
            pg_restore -U "$DB_USER" -h localhost -d "$DB_NAME" --clean --if-exists -v "$DUMP_FILE"
        elif [[ "$DUMP_FILE" == *.sql ]]; then
            psql -U "$DB_USER" -h localhost -d "$DB_NAME" < "$DUMP_FILE"
        elif [[ "$DUMP_FILE" == *.json ]]; then
            source "$BACKEND_DIR/venv/bin/activate"
            python "$BACKEND_DIR/manage.py" loaddata "$DUMP_FILE"
        fi

        # Restore media if archive exists
        if [ -f "$BACKUP_DIR/latest_media.tar.gz" ]; then
            echo "🖼️  Restoring media files..."
            tar -xzf "$BACKUP_DIR/latest_media.tar.gz" -C "$BACKEND_DIR"
            sudo chown -R ubuntu:www-data "$BACKEND_DIR/media"
        fi

        sudo systemctl start goimomi || true
        echo "✅ Database & Media restoration complete!"
        ;;

    *)
        echo "Usage: $0 {backup|restore [file]}"
        exit 1
        ;;
esac


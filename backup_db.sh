#!/bin/bash
# Goimomi DB Auto-Backup Script
set -e

BACKEND_DIR=/home/ubuntu/goimomi/goimomibackend
BACKUP_DIR=/home/ubuntu/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup dir if not exists
mkdir -p $BACKUP_DIR

# Activate venv
source $BACKEND_DIR/venv/bin/activate

# Dump DB data (Holidays app)
python $BACKEND_DIR/manage.py dumpdata Holidays --indent 2 -o $BACKUP_DIR/goimomi_db_dumpdata.json
echo "[DB] Dumpdata saved: $BACKUP_DIR/goimomi_db_dumpdata.json"

# Also save a timestamped copy (keep last 7 days)
cp $BACKUP_DIR/goimomi_db_dumpdata.json $BACKUP_DIR/goimomi_db_dumpdata_$TIMESTAMP.json
echo "[DB] Timestamped copy saved."

# Remove backups older than 7 days
find $BACKUP_DIR -name 'goimomi_db_dumpdata_*.json' -mtime +7 -delete
echo "[DB] Old backups cleaned."

# Tar media folder
tar -czf $BACKUP_DIR/goimomi_media.tar.gz -C $BACKEND_DIR media
echo "[MEDIA] Media archive saved."

echo "[DONE] Backup completed at $TIMESTAMP"

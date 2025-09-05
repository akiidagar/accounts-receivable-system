#!/bin/bash

BACKUP_DIR="backups"
DB_FILE="data/accounts_receivable.db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_FILE"
    echo "✅ Database backed up to: $BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "✅ Backup compressed: ${BACKUP_FILE}.gz"
    
    # Keep only last 30 days of backups
    find $BACKUP_DIR -name "backup_*.db.gz" -mtime +30 -delete
    echo "🧹 Old backups cleaned up"
else
    echo "❌ Database file not found: $DB_FILE"
    exit 1
fi

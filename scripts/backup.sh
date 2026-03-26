#!/bin/bash
# ============================================================
# MyA PostgreSQL Backup Script
# Dumps database, rotates old backups (7-day retention)
# ============================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_NAME="${DB_NAME:-mya_db}"
DB_USER="${DB_USER:-mya_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
RETENTION_DAYS=7

# Timestamp for backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/mya_backup_${TIMESTAMP}.sql.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump not found. Please install PostgreSQL client."
        exit 1
    fi
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_info "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Perform backup
perform_backup() {
    log_info "Starting backup of database: $DB_NAME"
    
    # Export PGPASSWORD for non-interactive auth
    export PGPASSWORD="${DB_PASSWORD:-mya_pass123}"
    
    # Run pg_dump with compression
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
        log_info "Backup created: $BACKUP_FILE"
        
        # Get file size
        SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_info "Backup size: $SIZE"
    else
        log_error "Backup failed!"
        rm -f "$BACKUP_FILE"
        exit 1
    fi
    
    # Unset PGPASSWORD
    unset PGPASSWORD
}

# Rotate old backups (keep last 7)
rotate_backups() {
    log_info "Rotating old backups (keeping last $RETENTION_DAYS days)..."
    
    # Find and delete backups older than retention period
    find "$BACKUP_DIR" -name "mya_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    
    # Count remaining backups
    COUNT=$(find "$BACKUP_DIR" -name "mya_backup_*.sql.gz" | wc -l)
    log_info "Backup rotation complete. Total backups: $COUNT"
}

# List existing backups
list_backups() {
    echo ""
    echo "Existing backups:"
    echo "================="
    ls -lh "$BACKUP_DIR"/mya_backup_*.sql.gz 2>/dev/null || echo "No backups found."
    echo ""
}

# Main execution
main() {
    echo "=========================================="
    echo "  MyA Database Backup Script"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    perform_backup
    rotate_backups
    list_backups
    
    log_info "Backup completed successfully!"
    exit 0
}

# Handle script arguments
case "${1:-}" in
    list)
        list_backups
        ;;
    rotate)
        rotate_backups
        ;;
    *)
        main
        ;;
esac
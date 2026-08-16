#!/usr/bin/env python3
"""Run Alembic migrations to upgrade database schema"""

import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from alembic.config import Config
from alembic import command

# Create Alembic configuration
alembic_cfg = Config("alembic.ini")

# Run the upgrade
try:
    print("Running database migrations...")
    command.upgrade(alembic_cfg, "head")
    print("✓ Migration completed successfully!")
    print("✓ All database schema updates have been applied.")
except Exception as e:
    print(f"✗ Migration failed: {e}")
    sys.exit(1)

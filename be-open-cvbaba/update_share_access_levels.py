#!/usr/bin/env python3
"""
Update existing chat shares to ensure all have proper access_level values.
This script sets any NULL or missing access_level to 'view' (default).
"""

import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_existing_shares():
    """Update existing chat shares to have proper access_level"""
    
    # Create database engine
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Start a transaction
            trans = conn.begin()
            
            try:
                # Check how many shares need updating
                result = conn.execute(text(
                    "SELECT COUNT(*) FROM chat_shares WHERE access_level IS NULL"
                ))
                count = result.scalar()
                
                logger.info(f"Found {count} chat shares with NULL access_level")
                
                if count > 0:
                    # Update NULL access_level to 'view'
                    conn.execute(text(
                        "UPDATE chat_shares SET access_level = 'view' WHERE access_level IS NULL"
                    ))
                    logger.info(f"✓ Updated {count} chat shares to have 'view' access level")
                else:
                    logger.info("✓ All chat shares already have proper access_level values")
                
                # Verify the update
                result = conn.execute(text(
                    "SELECT COUNT(*) FROM chat_shares"
                ))
                total = result.scalar()
                
                result = conn.execute(text(
                    "SELECT COUNT(*) FROM chat_shares WHERE access_level IS NOT NULL"
                ))
                valid = result.scalar()
                
                logger.info(f"✓ Total shares: {total}, Valid access levels: {valid}")
                
                # Show distribution of access levels
                result = conn.execute(text(
                    "SELECT access_level, COUNT(*) as count FROM chat_shares GROUP BY access_level ORDER BY count DESC"
                ))
                
                logger.info("\nAccess level distribution:")
                for row in result:
                    logger.info(f"  {row[0]}: {row[1]} shares")
                
                # Commit the transaction
                trans.commit()
                logger.info("\n✓ All existing chat shares have been updated successfully!")
                
            except Exception as e:
                trans.rollback()
                logger.error(f"✗ Error updating shares: {e}")
                raise
                
    except Exception as e:
        logger.error(f"✗ Failed to connect to database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    logger.info("Starting chat shares access_level update...")
    update_existing_shares()
    logger.info("Update complete!")

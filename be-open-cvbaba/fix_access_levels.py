#!/usr/bin/env python3
"""Manually update access levels from READ/WRITE to view/edit"""

from sqlalchemy import create_engine, text
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(settings.DATABASE_URL)

with engine.connect() as conn:
    # Begin transaction
    trans = conn.begin()
    
    try:
        # Show current state
        result = conn.execute(text('SELECT COUNT(*) FROM chat_shares WHERE access_level = :old_val'), {'old_val': 'READ'})
        read_count = result.scalar()
        logger.info(f"Found {read_count} shares with 'READ' access level")
        
        result = conn.execute(text('SELECT COUNT(*) FROM chat_shares WHERE access_level = :old_val'), {'old_val': 'WRITE'})
        write_count = result.scalar()
        logger.info(f"Found {write_count} shares with 'WRITE' access level")
        
        # Update READ to view
        if read_count > 0:
            conn.execute(text("UPDATE chat_shares SET access_level = 'view' WHERE access_level = 'READ'"))
            logger.info(f"✓ Updated {read_count} shares from 'READ' to 'view'")
        
        # Update WRITE to edit
        if write_count > 0:
            conn.execute(text("UPDATE chat_shares SET access_level = 'edit' WHERE access_level = 'WRITE'"))
            logger.info(f"✓ Updated {write_count} shares from 'WRITE' to 'edit'")
        
        # Commit
        trans.commit()
        logger.info("✓ Changes committed!")
        
        # Verify
        result = conn.execute(text('SELECT access_level, COUNT(*) FROM chat_shares GROUP BY access_level'))
        logger.info("\nFinal distribution:")
        for row in result:
            logger.info(f"  {row[0]}: {row[1]}")
            
    except Exception as e:
        trans.rollback()
        logger.error(f"✗ Error: {e}")
        raise

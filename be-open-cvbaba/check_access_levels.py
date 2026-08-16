from sqlalchemy import create_engine, text
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.connect() as conn:
    result = conn.execute(text('SELECT access_level, COUNT(*) FROM chat_shares GROUP BY access_level'))
    print('Access levels:')
    for row in result:
        print(f'  {row[0]}: {row[1]}')

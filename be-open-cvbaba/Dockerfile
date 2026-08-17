FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "python -c 'import asyncio; from app.db import init_db; asyncio.run(init_db())' && alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]

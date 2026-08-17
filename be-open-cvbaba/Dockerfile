FROM python:3.12-slim
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libcairo2 \
        libglib2.0-0 \
        libpango-1.0-0 \
        libpangoft2-1.0-0 \
        libharfbuzz0b \
        libharfbuzz-subset0 \
        libgdk-pixbuf-2.0-0 \
        libffi8 \
        shared-mime-info \
    && rm -rf /var/lib/apt/lists/*
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "python -c 'import asyncio; from app.db import init_db; asyncio.run(init_db())' && alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]

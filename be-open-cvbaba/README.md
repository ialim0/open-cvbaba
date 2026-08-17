# open-cvbaba API

FastAPI backend for [open-cvbaba](../README.md) — providing streaming AI document generation, Mistral OCR, Voxtral voice transcription, HTML/PDF rendering, and PostgreSQL persistence.

## Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) & Uvicorn / Gunicorn
- **Language**: Python 3.12
- **Database**: PostgreSQL 16 with SQLAlchemy & Alembic migrations
- **AI Providers**: Mistral AI (`mistralai` SDK and OpenAI-compatible client)
- **Document Processing**: WeasyPrint, PyPDF2, python-docx, Pillow, BeautifulSoup4
- **Cache**: Redis with `fastapi-cache2`

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 16 (or run via Docker Compose)
- Redis (optional, for caching)

### Installation

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Configuration

Create a `.env` file in the backend directory (or root):

```bash
cp ../.env.example .env
```

Ensure `DATABASE_URL` and `MISTRAL_API_KEY` are configured.

### Database Migrations

```bash
# Run Alembic migrations
python run_migration.py
# or directly with alembic
alembic upgrade head
```

### Running Locally

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/cb/doc-cb`
- ReDoc: `http://localhost:8000/cb/redoc-cb`

### Testing & Validation

```bash
# Verify Python syntax and compilation
python3 -m compileall -q app

# Run pytest (if tests are added)
pytest
```

## API Structure

```text
app/
├── api/
│   ├── routes/
│   │   ├── chat.py             # Document generation, SSE streaming, and chat history
│   │   ├── chat_comment.py     # Document page comments
│   │   ├── feedback.py         # Feedback collection
│   │   ├── file_upload.py      # File and image upload handling
│   │   ├── mistral_media.py    # Mistral OCR and Voxtral voice transcription
│   │   └── page_notes.py       # Page-level notes
├── core/                       # Core utilities and helpers
├── models/                     # SQLAlchemy database models
├── schemas/                    # Pydantic request/response schemas
├── services/                   # Business logic and external service integrations
│   ├── chat/                   # AI prompt generation, templates, and streaming handlers
│   └── s3_service.py           # Optional asset storage
├── templates/                  # Document template HTML and styling definitions
├── config.py                   # Pydantic Settings configuration
├── db.py                       # Database connection and session setup
└── main.py                     # FastAPI application entrypoint
```

## Contributing

Please see the root [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

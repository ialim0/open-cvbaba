# open-cvbaba API

FastAPI backend for anonymous, PostgreSQL-backed document creation.

## Local development

```bash
cp ../.env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API uses an `X-Workspace-ID` header to keep document history separated between local workspaces. It does not implement user accounts or authentication.

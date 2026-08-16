"""Anonymous local workspace identity for self-hosted development."""
from fastapi import Header, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User

def get_workspace_user(workspace_id: str | None = Header(default=None, alias="X-Workspace-ID"), db: Session = Depends(get_db)) -> User:
    workspace_id = (workspace_id or "default").strip()[:64]
    if not workspace_id.replace("-", "").replace("_", "").isalnum(): workspace_id = "default"
    email = f"workspace-{workspace_id}@local.invalid"
    user = db.query(User).filter(User.email == email).first()
    if user: return user
    user = User(email=email, full_name="Local workspace", is_active=True)
    db.add(user); db.commit(); db.refresh(user); return user

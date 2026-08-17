# Contributing to open-cvbaba

Thank you for your interest in contributing to open-cvbaba! open-cvbaba is an open-source, local-first AI document designer and creator maintained by [ialim0](https://github.com/ialim0).

We welcome contributions of all kinds: bug fixes, new document templates, feature additions, documentation improvements, UI/UX polish, translations, and architectural enhancements.

---

## Code of Conduct

All contributors and participants are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the maintainer.

---

## Getting Started

### Prerequisites

You can run the project in two ways:

1. **Docker (Recommended)**:
   - [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
2. **Manual / Bare Metal**:
   - Node.js 20+ and npm
   - Python 3.12+
   - PostgreSQL 16
   - (Optional) Redis

---

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/<your-username>/open-cvbaba.git
cd open-cvbaba
```

### 2. Configure Environment

Copy the example environment configuration:

```bash
cp .env.example .env
```

Add your `MISTRAL_API_KEY` to `.env` if you plan to test AI generation, OCR, or voice transcription.

### 3. Run Locally

#### Option A: With Docker Compose (Recommended)

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/cb/doc-cb](http://localhost:8000/cb/doc-cb)

#### Option B: Manual Setup

**Backend:**
```bash
cd be-open-cvbaba
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run_migration.py
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd fe-open-cvbaba
npm install
npm run dev
```

---

## Branch Naming Conventions

Create a new branch from `main` using descriptive naming:

- `feat/feature-name` (e.g., `feat/latex-export-support`)
- `fix/issue-description` (e.g., `fix/a4-page-overflow`)
- `docs/doc-update` (e.g., `docs/add-deployment-guide`)
- `refactor/component-name` (e.g., `refactor/activity-chat-state`)
- `template/template-name` (e.g., `template/minimal-academic-cv`)

---

## Quality & Validation Checks

Before submitting a pull request, ensure all local checks pass:

### Backend Checks
```bash
# Verify Python syntax and bytecode compilation
python3 -m compileall -q be-open-cvbaba/app
```

### Frontend Checks
```bash
cd fe-open-cvbaba

# TypeScript compilation check
npm run type-check

# ESLint check
npm run lint

# Production build check
npm run build
```

### Docker Check
```bash
# Validate compose configuration
docker compose config
```

---

## Pull Request Guidelines

1. Keep pull requests focused on a single concern or feature.
2. Include a clear description of the problem and solution in the PR description (using the provided [PR Template](.github/pull_request_template.md)).
3. Include screenshots or screen recordings for UI changes.
4. Ensure no secrets, `.env` files, build outputs, or personal information are committed.
5. Link any related GitHub issues (e.g., `Fixes #123` or `Closes #456`).

---

## Security Vulnerabilities

If you discover a security vulnerability, please do **not** open a public issue. Follow the instructions in [SECURITY.md](SECURITY.md) to report it privately.

Thank you for making open-cvbaba better!

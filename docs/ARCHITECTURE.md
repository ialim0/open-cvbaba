# Architecture

open-cvbaba is a local-first document workspace. The browser owns interaction and preview; the FastAPI service owns orchestration and persistence; PostgreSQL stores document state; Mistral provides generation, OCR, and transcription.

## Runtime topology

```text
Browser
  ├── Next.js UI and editable HTML preview (Shadow DOM)
  ├── SSE document-generation stream
  └── WebSocket Voxtral realtime stream
          │
          ▼
FastAPI
  ├── workspace identification (X-Workspace-ID)
  ├── LangGraph document orchestration pipeline
  ├── Mistral Chat Completions (Mistral Large & Codestral)
  ├── Mistral OCR and Voxtral
  └── HTML/PDF/Word rendering
          │
          ├── PostgreSQL: documents, versions, pages, notes, comments
          └── Mistral API
```

## Boundaries

### Frontend

The Next.js application provides document selection, prompt forms, upload and voice input, live generation, document editing, and export controls. It does not contain provider credentials or call Mistral directly.

### API & LangGraph Orchestration

The FastAPI application validates requests, resolves an anonymous workspace, prepares prompts, and executes the document lifecycle via **LangGraph**:

1. **Intent Analysis**: Classifies document structure and requirements.
2. **Section Planning**: Establishes optimal layout order and content density.
3. **HTML/CSS Generation**: Streams semantic, isolated HTML markup using Codestral / Mistral Large.
4. **Visual Layout Evaluation & Critique**: Validates page boundaries and checks for overflow, automatically triggering layout rebalancing.

The workspace identifier is supplied through `X-Workspace-ID`; there is no login or account lifecycle.

### AI layer

All AI capabilities are centralized around Mistral:

- Native `chat.stream_async` for real-time document generation and in-place edits.
- Mistral OCR for PDF and image text extraction.
- Voxtral Mini Transcribe for uploaded audio and realtime 16 kHz PCM transcription over WebSockets.

No Google, Gemini, DeepSeek, Anthropic, or OpenAI service credentials are required.

### Persistence

PostgreSQL stores anonymous local workspaces, chats, document content, versions, pages, comments, and notes. The database is mounted as the `postgres_data` Docker volume.

## Streaming lifecycle

1. The browser opens an SSE request for document generation.
2. The API builds system and user messages with document requirements and context.
3. Mistral returns asynchronous Chat Completion chunks.
4. The API forwards text chunks as SSE events.
5. The browser updates the preview incrementally inside an isolated Shadow DOM sandbox.
6. The API saves final content and emits a completion event.

Realtime voice input follows the same principle over WebSocket. The browser sends mono 16-bit PCM at 16 kHz; Voxtral returns events that the API maps to partial and final frontend messages.

## Roadmap & Feature Evolution

- **Core Active Workflow**: Text prompts, voice dictation, template selection, and multimodal OCR ingestion.
- **Future Evolution**: Hand-drawn napkin sketch / canvas wireframe interpretation is an experimental research concept deferred to future releases to maintain maximum speed, reliability, and determinism in the core open-source release.

## Local deployment

Docker Compose starts PostgreSQL 16, FastAPI on port 8000, and Next.js on port 3000. Only `MISTRAL_API_KEY` is required for AI features.

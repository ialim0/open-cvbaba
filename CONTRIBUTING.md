# Contributing to open-cvbaba

Thank you for helping improve open-cvbaba. The project is maintained by [ialim0](https://github.com/ialim0) and welcomes contributions from everyone.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- For larger changes, open an issue first so the design can be discussed.
- Never commit API keys, passwords, local `.env` files, generated build output, virtual environments, or personal data.

## Development workflow

1. Fork the repository and clone your fork.
2. Create a branch such as `fix/ocr-upload`, `docs/architecture`, or `feature/template`.
3. Copy `.env.example` to `.env` and add a Mistral API key when testing AI features.
4. Start the stack with `docker compose up --build`.
5. Keep frontend and backend changes focused and explain behavior changes in the pull request.

## Validation

Run the checks relevant to your change:

````bash
python3 -m compileall -q be-open-cvbaba/app
docker compose config
````

If frontend dependencies are installed, also run the frontend typecheck or build command defined in `fe-open-cvbaba/package.json`.

## Pull requests

A good pull request includes:

- A concise problem statement.
- A description of the implementation.
- Screenshots or recordings for UI changes when useful.
- Tests or validation commands and their results.
- Notes about migrations, configuration, or backwards compatibility.

Be respectful in reviews and follow the project Code of Conduct.

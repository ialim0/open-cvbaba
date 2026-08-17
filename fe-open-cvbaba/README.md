# open-cvbaba Frontend

Next.js web application for [open-cvbaba](../README.md) — an open-source, local-first AI document designer and creator.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript 5
- **UI & Styling**: Tailwind CSS, Radix UI primitives, Lucide Icons, FontAwesome
- **State & Animations**: React 18, Framer Motion
- **Internationalization**: `i18next` & `react-i18next` with multi-language locale support
- **Export & Rendering**: Live HTML Shadow DOM preview with A4 pagination and PDF / Word export

## Getting Started

### Prerequisites

- Node.js 20+ (Node 20 or 22 recommended)
- npm or pnpm

### Installation

```bash
# From the fe-open-cvbaba directory
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

By default, the frontend connects to the backend API at `http://localhost:8000`. You can configure this with the `NEXT_PUBLIC_API_BASE_URL` environment variable.

### Building & Verification

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Production build
npm run build
```

## Project Structure

```text
src/
├── app/
│   ├── about/              # About page
│   ├── activity/           # Main workspace / document generation & editing interface
│   ├── api/                # Next.js API route handlers (streaming proxies)
│   ├── components/         # Reusable React components
│   │   ├── ActivityChat/   # Document prompts, chat flow, template pickers
│   │   ├── PdfPreview/     # WYSIWYG Shadow DOM document preview & export
│   │   ├── Sidebar/        # Workspace navigation & history
│   │   └── ui/             # Core UI components (Buttons, Modals, Tooltips, etc.)
│   ├── contexts/           # React context providers (Language, Theme)
│   ├── hooks/              # Custom hooks (speech-to-text, streaming, etc.)
│   ├── i18n/               # Localization initialization
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Document formatting, pagination, and styling helpers
│   └── globals.css         # Global stylesheet & design tokens
└── public/
    ├── locales/            # JSON translation bundles
    └── templates/          # Template previews and thumbnails
```

## Contributing

Please see the root [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

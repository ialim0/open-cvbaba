import Image from 'next/image';
import Link from 'next/link';

const milestones = [
  ['2024', 'Research begins', 'AI could generate text and code, but reliably producing a polished, compilable document end to end was still difficult.'],
  ['2024', 'LaTeX tooling and data research', 'The first experiments focused on browser-friendly LaTeX compilation and structured annotation for high-quality CV data.'],
  ['2025', 'Editable HTML documents', 'HTML became the practical format for a faster WYSIWYG workflow.'],
  ['Now', 'Open-source CV workspace', 'open-cvbaba is a self-hostable workspace for creating polished CVs with Mistral-powered generation.'],
];

const roadmap = [
  ['In progress', 'More CV templates', 'Add more ATS-friendly, academic, technical, creative, and regional CV layouts with reusable preview components.'],
  ['Next', 'Deeper documentation', 'Expand setup guides, API references, architecture notes, provider configuration, troubleshooting, and contribution examples.'],
  ['Next', 'Full LaTeX support', 'Bring LaTeX generation, compilation, import, preview, and PDF export into the same visual feedback workflow.'],
  ['Exploring', 'Richer generation workflows', 'Improve vision-to-layout, brand-aware retrieval, visual self-critique, accessibility checks, and document quality evaluation.'],
  ['Open ended', 'Community-led features', 'New ideas are welcome. The roadmap will evolve through issues, pull requests, experiments, and real-world CV feedback.'],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
          &larr; Back to open-cvbaba
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">About the project</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            An open-source AI workspace for better CVs.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            open-cvbaba makes AI-assisted CV creation reliable, editable, visual, and easy to run locally.
          </p>
        </header>

        <section className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
          <Image
            src="/images/architecture-overview.png"
            alt="Technical architecture overview of the open-cvbaba CV generation platform"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full rounded-2xl"
          />
          <p className="px-2 pb-1 pt-4 text-sm leading-6 text-slate-500 sm:px-3">
            The architecture combines multimodal input, LangGraph planning, brand-aware pgvector retrieval,
            visual self-critique, persistence, and local Docker infrastructure.
          </p>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold">Why it started</h2>
          <div className="mt-5 space-y-5 leading-8 text-slate-600">
            <p>
              AI tools can generate useful text and code, but producing a polished CV end to end still requires
              careful layout, rendering, editing, and quality review.
            </p>
            <p>
              open-cvbaba focuses on that complete path: prompt, structure, generation, visual preview, editing,
              validation, and export. The goal is a result people can use immediately, not just a block of generated text.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Research path</h2>
          <div className="mt-8 space-y-5">
            {milestones.map(([year, title, text]) => (
              <article key={year} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-[100px_1fr] sm:gap-6">
                <p className="font-semibold text-blue-600">{year}</p>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Roadmap</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            The project is intentionally open. These priorities describe the direction, not a fixed promise or release schedule.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {roadmap.map(([status, title, text]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{status}</p>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold">What we are building</h2>
            <p className="mt-4 leading-7 text-slate-300">
              A focused, open-source CV environment where history stays in PostgreSQL, generation uses Mistral,
              and output remains editable HTML that can be rendered to PDF.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold">Build with us</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Bring a template, improve the documentation, test LaTeX workflows, propose an evaluation case,
              or open an issue for a feature that would help people create better CVs.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-blue-100 bg-blue-50 p-8">
          <h2 className="text-2xl font-bold">Earlier research projects</h2>
          <ul className="mt-5 space-y-3 leading-7 text-slate-700">
            <li>
              <a className="font-semibold text-blue-700 hover:underline" href="https://github.com/ialim0/latex-compiler-api">
                latex-compiler-api
              </a>{' '}
              - browser-friendly LaTeX compilation experiments.
            </li>
            <li>
              <a className="font-semibold text-blue-700 hover:underline" href="https://github.com/ialim0/db-cvbaba">
                db-cvbaba
              </a>{' '}
              - structured annotation and dataset tooling for CV generation research.
            </li>
          </ul>
        </section>

        <footer className="mt-12 flex flex-wrap gap-5 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-600">Create a CV</Link>
          <a href="https://github.com/ialim0" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}

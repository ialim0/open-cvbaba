import Link from 'next/link';
import { ArrowRight, FileText, Mail } from 'lucide-react';

const documentTypes = [
  { type: 'cv', title: 'CV / Resume', description: 'Build a clear, professional CV that highlights your experience and strengths.', icon: FileText },
  { type: 'cover-letter', title: 'Cover Letter', description: 'Write a focused cover letter for your next opportunity.', icon: Mail },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">open-cvbaba</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">What do you want to create?</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Choose a CV or cover letter, then optionally start from a template.</p>
        </header>
        <section aria-label="Document types" className="grid gap-5 md:grid-cols-2">
          {documentTypes.map(({ type, title, description, icon: Icon }) => (
            <Link key={type} href={'/activity?mode=create&type=' + type} className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white"><Icon aria-hidden="true" className="h-6 w-6" /></span>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 flex-1 leading-7 text-slate-600">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">Start creating <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </section>
        <footer className="mt-10 flex flex-wrap gap-5 text-sm text-slate-500"><span>Open source CV and cover letter creation.</span><Link href="/about" className="font-semibold text-blue-600 hover:text-blue-800">About the project</Link></footer>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Questionario",
  description:
    "Rispondi a poche domande per trovare il professionista più adatto a te.",
};

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* Decorative blobs — purely visual, hidden from assistive technology */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-left blob */}
        <div
          className="absolute -top-32 -left-32 h-80 w-80 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle at center, var(--color-primary-200), transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        {/* Bottom-right blob */}
        <div
          className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, var(--color-secondary-200), transparent 70%)",
            filter: "blur(56px)",
          }}
        />
        {/* Center accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle at center, var(--color-accent-100), transparent 70%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Torna alla homepage di Synapsy"
        >
          {/* Wordmark */}
          <span className="font-heading font-bold text-lg text-text tracking-tight">
            Synap<span className="text-primary-500">sy</span>
          </span>
        </Link>

        {/* Exit link */}
        <Link
          href="/"
          className="text-sm text-text-secondary hover:text-text transition-colors rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Esci dal questionario e torna alla homepage"
        >
          Esci
        </Link>
      </header>

      {/* Page content */}
      <main className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-12 sm:px-8">
        {children}
      </main>
    </div>
  );
}

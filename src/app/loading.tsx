import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
      {/* Pulsing Brain icon */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-md animate-pulse">
        <Brain className="h-8 w-8" aria-hidden="true" />
        {/* Ripple ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-primary-400 opacity-40 animate-ping"
        />
      </div>

      {/* Spinner ring below */}
      <div
        aria-hidden="true"
        className="h-6 w-6 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin"
      />

      <p className="font-body text-sm font-medium text-text-secondary animate-pulse">
        Caricamento...
      </p>

      {/* Screen-reader announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        Caricamento in corso, attendere prego.
      </span>
    </div>
  );
}

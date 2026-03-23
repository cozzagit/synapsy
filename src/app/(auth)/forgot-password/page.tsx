"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Note: metadata cannot be used in Client Components.
// Title is set via the parent layout template: "Recupera password | Synapsy"

interface FormState {
  email: string;
  error: string | null;
  submitted: boolean;
  isLoading: boolean;
}

export default function ForgotPasswordPage() {
  const [state, setState] = useState<FormState>({
    email: "",
    error: null,
    submitted: false,
    isLoading: false,
  });

  function validateEmail(email: string): string | null {
    if (!email.trim()) return "L'email è obbligatoria.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Inserisci un indirizzo email valido.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailError = validateEmail(state.email);
    if (emailError) {
      setState((prev) => ({ ...prev, error: emailError }));
      return;
    }

    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    // Placeholder — actual password reset will be implemented with Better Auth
    await new Promise((resolve) => setTimeout(resolve, 800));

    setState((prev) => ({ ...prev, isLoading: false, submitted: true }));
  }

  // Success state
  if (state.submitted) {
    return (
      <>
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
            <CheckCircle className="h-7 w-7 text-primary-600" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
            Email inviata
          </h1>
          <p className="mt-3 text-text-secondary leading-relaxed max-w-sm">
            Se l&apos;email è registrata, riceverai un link per reimpostare la
            password. Controlla anche la cartella spam.
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p>
            <Link
              href="/login"
              className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
            >
              Torna al login
            </Link>
          </p>
          <p>
            Non hai ricevuto nulla?{" "}
            <button
              type="button"
              onClick={() =>
                setState({
                  email: "",
                  error: null,
                  submitted: false,
                  isLoading: false,
                })
              }
              className="font-medium text-text transition-colors hover:text-primary-600 hover:underline"
            >
              Riprova
            </button>
          </p>
        </div>
      </>
    );
  }

  // Form state
  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          Recupera password
        </h1>
        <p className="mt-2 text-text-secondary">
          Inserisci la tua email e ti invieremo un link per reimpostare la
          password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Error */}
        {state.error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{state.error}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-label="Indirizzo email"
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "email-error" : undefined}
            value={state.email}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                email: e.target.value,
                error: null,
              }))
            }
            disabled={state.isLoading}
            placeholder="nome@esempio.it"
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
              bg-bg-subtle transition-all duration-150 outline-none
              focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
              disabled:opacity-60
              ${state.error ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
            `}
          />
          {state.error && (
            <p id="email-error" role="alert" className="text-xs text-red-600">
              {state.error}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={state.isLoading}
          aria-busy={state.isLoading}
          className="
            mt-2 flex w-full items-center justify-center gap-2 rounded-xl
            bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white
            shadow-sm transition-all duration-150
            hover:bg-primary-600 hover:shadow-md
            active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          "
        >
          {state.isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {state.isLoading ? "Invio in corso…" : "Invia link di recupero"}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-text-secondary">
        <p>
          Ricordi la password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            Torna al login
          </Link>
        </p>
      </div>
    </>
  );
}

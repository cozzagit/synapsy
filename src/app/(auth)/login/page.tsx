"use client";

import type { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { useFormState } from "@/hooks/use-form";

// Note: export const metadata cannot be used in Client Components.
// Title is set via the parent layout template: "Accedi | Synapsy"

interface LoginFormValues {
  email: string;
  password: string;
}

const INITIAL_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

function validateLogin(values: LoginFormValues): Partial<Record<keyof LoginFormValues, string>> {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "L'email è obbligatoria.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Inserisci un indirizzo email valido.";
  }

  if (!values.password) {
    errors.password = "La password è obbligatoria.";
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { values, errors, isSubmitting, setField, setSubmitting, validate } =
    useFormState<LoginFormValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError(null);

    const isValid = validate(validateLogin);
    if (!isValid) return;

    setSubmitting(true);
    try {
      const result = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setGlobalError("Credenziali non valide. Controlla email e password.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setGlobalError(
        "Si è verificato un errore. Riprova tra qualche istante.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          Bentornato
        </h1>
        <p className="mt-2 text-text-secondary">
          Accedi al tuo spazio su Synapsy.
        </p>
      </div>

      {/* Global error */}
      {globalError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            disabled={isSubmitting}
            placeholder="nome@esempio.it"
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
              bg-bg-subtle transition-all duration-150 outline-none
              focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
              disabled:opacity-60
              ${errors.email ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
            `}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary-600 transition-colors hover:text-primary-700 hover:underline"
            >
              Password dimenticata?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              disabled={isSubmitting}
              placeholder="La tua password"
              className={`
                w-full rounded-xl border px-4 py-3 pr-11 text-sm text-text placeholder:text-text-tertiary
                bg-bg-subtle transition-all duration-150 outline-none
                focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
                disabled:opacity-60
                ${errors.password ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" role="alert" className="text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
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
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {isSubmitting ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 space-y-3 border-t border-border pt-6 text-center text-sm text-text-secondary">
        <p>
          Non hai un account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            Registrati
          </Link>
        </p>
        <p>
          Sei uno psicologo?{" "}
          <Link
            href="/register/psychologist"
            className="font-medium text-secondary-600 transition-colors hover:text-secondary-700 hover:underline"
          >
            Registrati qui
          </Link>
        </p>
      </div>
    </>
  );
}

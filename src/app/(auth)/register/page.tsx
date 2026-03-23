"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { signUp } from "@/lib/auth/client";
import { useFormState } from "@/hooks/use-form";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyConsent: boolean;
}

const INITIAL_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  privacyConsent: false,
};

function validateRegister(
  values: RegisterFormValues,
): Partial<Record<keyof RegisterFormValues, string>> {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = "Il nome è obbligatorio.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Il nome deve contenere almeno 2 caratteri.";
  }

  if (!values.email.trim()) {
    errors.email = "L'email è obbligatoria.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Inserisci un indirizzo email valido.";
  }

  if (!values.password) {
    errors.password = "La password è obbligatoria.";
  } else if (values.password.length < 12) {
    errors.password = "La password deve contenere almeno 12 caratteri.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Conferma la tua password.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Le password non corrispondono.";
  }

  if (!values.privacyConsent) {
    errors.privacyConsent =
      "Devi accettare il trattamento dei dati per continuare.";
  }

  return errors;
}

function PasswordStrengthHint({ password }: { password: string }) {
  const hasLength = password.length >= 12;

  if (!password) return null;

  return (
    <p
      className={`flex items-center gap-1.5 text-xs transition-colors ${
        hasLength ? "text-primary-600" : "text-text-tertiary"
      }`}
      aria-live="polite"
    >
      {hasLength ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <span
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold"
          aria-hidden="true"
        >
          !
        </span>
      )}
      {hasLength
        ? "Password sufficientemente lunga"
        : `Almeno 12 caratteri (${password.length}/12)`}
    </p>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { values, errors, isSubmitting, setField, setSubmitting, validate } =
    useFormState<RegisterFormValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError(null);

    const isValid = validate(validateRegister);
    if (!isValid) return;

    setSubmitting(true);
    try {
      const result = await signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "user",
        callbackURL: "/dashboard",
      } as Parameters<typeof signUp.email>[0]);

      if (result.error) {
        if (result.error.message?.toLowerCase().includes("email")) {
          setGlobalError(
            "Questo indirizzo email è già in uso. Prova ad accedere.",
          );
        } else {
          setGlobalError(
            "Registrazione non riuscita. Riprova tra qualche istante.",
          );
        }
        return;
      }

      // Send welcome notification
      try {
        await fetch("/api/auth/hooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: result.data?.user?.id,
            role: "user",
            email: values.email.trim(),
            name: values.name.trim(),
          }),
        });
      } catch {
        // Non-critical
      }

      router.push("/questionnaire");
    } catch {
      setGlobalError("Si è verificato un errore. Riprova tra qualche istante.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          Crea il tuo account
        </h1>
        <p className="mt-2 text-text-secondary">
          Trova il professionista più adatto a te.
        </p>
      </div>

      {/* Global error */}
      {globalError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{globalError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-text">
            Nome e cognome
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-label="Nome e cognome"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            disabled={isSubmitting}
            placeholder="Mario Rossi"
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
              bg-bg-subtle transition-all duration-150 outline-none
              focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
              disabled:opacity-60
              ${errors.name ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
            `}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : "password-hint"
              }
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              disabled={isSubmitting}
              placeholder="Minimo 12 caratteri"
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
          {errors.password ? (
            <p
              id="password-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.password}
            </p>
          ) : (
            <div id="password-hint">
              <PasswordStrengthHint password={values.password} />
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-text"
          >
            Conferma password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-label="Conferma password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              value={values.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              disabled={isSubmitting}
              placeholder="Ripeti la password"
              className={`
                w-full rounded-xl border px-4 py-3 pr-11 text-sm text-text placeholder:text-text-tertiary
                bg-bg-subtle transition-all duration-150 outline-none
                focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
                disabled:opacity-60
                ${errors.confirmPassword ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword
                  ? "Nascondi conferma password"
                  : "Mostra conferma password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Privacy consent */}
        <div className="space-y-1.5 pt-1">
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                id="privacyConsent"
                aria-label="Acconsento al trattamento dei dati personali"
                aria-invalid={!!errors.privacyConsent}
                aria-describedby={
                  errors.privacyConsent ? "privacy-error" : undefined
                }
                checked={values.privacyConsent}
                onChange={(e) =>
                  setField("privacyConsent", e.target.checked)
                }
                disabled={isSubmitting}
                className="sr-only"
              />
              <div
                aria-hidden="true"
                className={`
                  flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-150
                  ${
                    values.privacyConsent
                      ? "border-primary-500 bg-primary-500"
                      : errors.privacyConsent
                        ? "border-red-400 bg-red-50"
                        : "border-border bg-bg-subtle"
                  }
                `}
              >
                {values.privacyConsent && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 12 12"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 6l3 3 5-5"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed text-text-secondary">
              Acconsento al trattamento dei miei dati personali secondo la{" "}
              <Link
                href="/privacy"
                className="text-primary-600 underline-offset-2 transition-colors hover:text-primary-700 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.privacyConsent && (
            <p
              id="privacy-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.privacyConsent}
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
          {isSubmitting ? "Creazione account…" : "Crea il tuo account"}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-text-secondary">
        <p>
          Hai già un account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            Accedi
          </Link>
        </p>
      </div>
    </>
  );
}

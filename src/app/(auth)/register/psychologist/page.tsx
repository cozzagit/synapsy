"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signUp } from "@/lib/auth/client";
import { useFormState } from "@/hooks/use-form";

// ─── Constants ───────────────────────────────────────────────────────────────

const AREE_TRATTATE = [
  "Ansia",
  "Depressione",
  "Stress",
  "Burnout",
  "Relazioni",
  "Famiglia",
  "Lutto",
  "Trauma",
  "Autostima",
  "Disturbi alimentari",
  "Dipendenze",
  "Sonno",
  "Rabbia",
  "Fobie",
  "DOC",
  "Sessualità",
  "Identità",
  "Lavoro",
  "Studio",
  "Genitorialità",
  "Ansia sociale",
  "Attacchi di panico",
  "Transizioni di vita",
  "Malattia cronica",
] as const;

const APPROCCI_TERAPEUTICI = [
  "CBT",
  "Psicodinamico",
  "Sistemico",
  "Umanistico",
  "Gestalt",
  "EMDR",
  "ACT",
  "DBT",
  "Mindfulness",
  "Psicoanalitico",
  "Integrativo",
  "Breve strategico",
  "Narrativo",
  "Arteterapia",
] as const;

const REGIONI_ITALIANE = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
] as const;

const TOTAL_STEPS = 3;
const BIO_BREVE_MAX = 200;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1Values {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  numeroAlbo: string;
  regioneAlbo: string;
}

interface Step2Values {
  areeTrattate: string[];
  approcci: string[];
  modalita: "online" | "studio" | "entrambi" | "";
}

interface Step3Values {
  bioBreve: string;
  bioCompleta: string;
  maxNuoviPazienti: string;
}

// ─── Validators ──────────────────────────────────────────────────────────────

function validateStep1(
  values: Step1Values,
): Partial<Record<keyof Step1Values, string>> {
  const errors: Partial<Record<keyof Step1Values, string>> = {};

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

  if (!values.numeroAlbo.trim()) {
    errors.numeroAlbo = "Il numero di iscrizione all'Albo è obbligatorio.";
  }

  if (!values.regioneAlbo) {
    errors.regioneAlbo = "Seleziona la regione dell'Albo.";
  }

  return errors;
}

function validateStep2(
  values: Step2Values,
): Partial<Record<keyof Step2Values, string>> {
  const errors: Partial<Record<keyof Step2Values, string>> = {};

  if (values.areeTrattate.length === 0) {
    errors.areeTrattate = "Seleziona almeno un'area di trattamento.";
  }

  if (values.approcci.length === 0) {
    errors.approcci = "Seleziona almeno un approccio terapeutico.";
  }

  if (!values.modalita) {
    errors.modalita = "Seleziona una modalità di lavoro.";
  }

  return errors;
}

function validateStep3(
  values: Step3Values,
): Partial<Record<keyof Step3Values, string>> {
  const errors: Partial<Record<keyof Step3Values, string>> = {};

  if (!values.bioBreve.trim()) {
    errors.bioBreve = "La bio breve è obbligatoria.";
  } else if (values.bioBreve.length > BIO_BREVE_MAX) {
    errors.bioBreve = `La bio breve non può superare ${BIO_BREVE_MAX} caratteri.`;
  }

  if (!values.bioCompleta.trim()) {
    errors.bioCompleta = "La bio completa è obbligatoria.";
  }

  if (values.maxNuoviPazienti !== "") {
    const n = Number(values.maxNuoviPazienti);
    if (isNaN(n) || n < 1 || n > 50) {
      errors.maxNuoviPazienti = "Inserisci un numero valido tra 1 e 50.";
    }
  }

  return errors;
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="text-xs text-red-600">
      {message}
    </p>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text">
      {children}
    </label>
  );
}

interface TextInputProps {
  id: string;
  type?: string;
  autoComplete?: string;
  ariaLabel: string;
  ariaDescribedBy?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
  rightAddon?: React.ReactNode;
}

function TextInput({
  id,
  type = "text",
  autoComplete,
  ariaLabel,
  ariaDescribedBy,
  value,
  onChange,
  disabled,
  placeholder,
  hasError,
  rightAddon,
}: TextInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
          bg-bg-subtle transition-all duration-150 outline-none
          focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
          disabled:opacity-60
          ${rightAddon ? "pr-11" : ""}
          ${hasError ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
        `}
      />
      {rightAddon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightAddon}
        </div>
      )}
    </div>
  );
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

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  total,
}: {
  currentStep: number;
  total: number;
}) {
  const labels = ["Account", "Profilo", "Bio"];

  return (
    <div className="mb-8 flex items-center justify-center gap-0" role="list" aria-label="Passaggi di registrazione">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={stepNum} className="flex items-center" role="listitem">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-primary-500 text-white"
                      : isCurrent
                        ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                        : "bg-border text-text-tertiary"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 12 12"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 6l3 3 5-5"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium ${
                  isCurrent ? "text-primary-600" : "text-text-tertiary"
                }`}
              >
                {labels[i]}
              </span>
            </div>

            {/* Connector */}
            {i < total - 1 && (
              <div
                aria-hidden="true"
                className={`
                  mb-4 mx-2 h-0.5 w-12 rounded-full transition-all duration-300
                  ${isCompleted ? "bg-primary-400" : "bg-border"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Account ─────────────────────────────────────────────────────────

function Step1({
  form,
}: {
  form: ReturnType<typeof useFormState<Step1Values>>;
}) {
  const { values, errors, isSubmitting, setField } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome e cognome</Label>
        <TextInput
          id="name"
          autoComplete="name"
          ariaLabel="Nome e cognome"
          ariaDescribedBy={errors.name ? "name-error" : undefined}
          value={values.name}
          onChange={(v) => setField("name", v)}
          disabled={isSubmitting}
          placeholder="Dott.ssa Maria Bianchi"
          hasError={!!errors.name}
        />
        {errors.name && <FieldError id="name-error" message={errors.name} />}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          ariaLabel="Indirizzo email"
          ariaDescribedBy={errors.email ? "email-error" : undefined}
          value={values.email}
          onChange={(v) => setField("email", v)}
          disabled={isSubmitting}
          placeholder="dottoressa@studio.it"
          hasError={!!errors.email}
        />
        {errors.email && (
          <FieldError id="email-error" message={errors.email} />
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <TextInput
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          ariaLabel="Password"
          ariaDescribedBy={
            errors.password ? "password-error" : "password-hint"
          }
          value={values.password}
          onChange={(v) => setField("password", v)}
          disabled={isSubmitting}
          placeholder="Minimo 12 caratteri"
          hasError={!!errors.password}
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              className="text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          }
        />
        {errors.password ? (
          <FieldError id="password-error" message={errors.password} />
        ) : (
          <div id="password-hint">
            <PasswordStrengthHint password={values.password} />
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <TextInput
          id="confirmPassword"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          ariaLabel="Conferma password"
          ariaDescribedBy={
            errors.confirmPassword ? "confirm-error" : undefined
          }
          value={values.confirmPassword}
          onChange={(v) => setField("confirmPassword", v)}
          disabled={isSubmitting}
          placeholder="Ripeti la password"
          hasError={!!errors.confirmPassword}
          rightAddon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm
                  ? "Nascondi conferma password"
                  : "Mostra conferma password"
              }
              className="text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          }
        />
        {errors.confirmPassword && (
          <FieldError id="confirm-error" message={errors.confirmPassword} />
        )}
      </div>

      {/* Albo row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Numero Albo */}
        <div className="space-y-1.5">
          <Label htmlFor="numeroAlbo">N° Albo</Label>
          <TextInput
            id="numeroAlbo"
            ariaLabel="Numero iscrizione all'Albo degli Psicologi"
            ariaDescribedBy={errors.numeroAlbo ? "albo-error" : undefined}
            value={values.numeroAlbo}
            onChange={(v) => setField("numeroAlbo", v)}
            disabled={isSubmitting}
            placeholder="es. 12345"
            hasError={!!errors.numeroAlbo}
          />
          {errors.numeroAlbo && (
            <FieldError id="albo-error" message={errors.numeroAlbo} />
          )}
        </div>

        {/* Regione Albo */}
        <div className="space-y-1.5">
          <Label htmlFor="regioneAlbo">Regione Albo</Label>
          <select
            id="regioneAlbo"
            aria-label="Regione dell'Albo degli Psicologi"
            aria-invalid={!!errors.regioneAlbo}
            aria-describedby={
              errors.regioneAlbo ? "regione-error" : undefined
            }
            value={values.regioneAlbo}
            onChange={(e) => setField("regioneAlbo", e.target.value)}
            disabled={isSubmitting}
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-text
              bg-bg-subtle transition-all duration-150 outline-none
              focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
              disabled:opacity-60
              ${errors.regioneAlbo ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
            `}
          >
            <option value="">Seleziona</option>
            {REGIONI_ITALIANE.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.regioneAlbo && (
            <FieldError id="regione-error" message={errors.regioneAlbo} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Profilo professionale ──────────────────────────────────────────

function MultiSelectGroup({
  id,
  legend,
  options,
  selected,
  onChange,
  errorId,
  hasError,
}: {
  id: string;
  legend: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  errorId?: string;
  hasError?: boolean;
}) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((v) => v !== option)
        : [...selected, option],
    );
  }

  return (
    <fieldset
      aria-describedby={errorId}
      className={`rounded-2xl border p-4 transition-colors ${
        hasError ? "border-red-300 bg-red-50" : "border-border bg-bg-subtle"
      }`}
    >
      <legend className="mb-3 px-1 text-sm font-medium text-text">
        {legend}
      </legend>
      <div
        role="group"
        aria-labelledby={`${id}-legend`}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(option)}
              className={`
                rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1
                ${
                  checked
                    ? "border-primary-400 bg-primary-100 text-primary-700"
                    : "border-border bg-surface text-text-secondary hover:border-primary-300 hover:text-text"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Step2({
  form,
}: {
  form: ReturnType<typeof useFormState<Step2Values>>;
}) {
  const { values, errors, setField } = form;

  return (
    <div className="space-y-6">
      {/* Aree trattate */}
      <div className="space-y-1.5">
        <MultiSelectGroup
          id="areeTrattate"
          legend="Aree trattate"
          options={AREE_TRATTATE}
          selected={values.areeTrattate}
          onChange={(v) => setField("areeTrattate", v)}
          errorId={errors.areeTrattate ? "aree-error" : undefined}
          hasError={!!errors.areeTrattate}
        />
        {errors.areeTrattate && (
          <FieldError id="aree-error" message={errors.areeTrattate} />
        )}
      </div>

      {/* Approcci */}
      <div className="space-y-1.5">
        <MultiSelectGroup
          id="approcci"
          legend="Approcci terapeutici"
          options={APPROCCI_TERAPEUTICI}
          selected={values.approcci}
          onChange={(v) => setField("approcci", v)}
          errorId={errors.approcci ? "approcci-error" : undefined}
          hasError={!!errors.approcci}
        />
        {errors.approcci && (
          <FieldError id="approcci-error" message={errors.approcci} />
        )}
      </div>

      {/* Modalità */}
      <div className="space-y-2">
        <fieldset
          aria-describedby={errors.modalita ? "modalita-error" : undefined}
        >
          <legend className="mb-3 text-sm font-medium text-text">
            Modalità di lavoro
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "online", label: "Online" },
                { value: "studio", label: "In studio" },
                { value: "entrambi", label: "Entrambi" },
              ] as const
            ).map(({ value, label }) => {
              const isSelected = values.modalita === value;
              return (
                <label
                  key={value}
                  className={`
                    flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-150
                    ${
                      isSelected
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-border bg-bg-subtle text-text-secondary hover:border-primary-300 hover:text-text"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="modalita"
                    value={value}
                    checked={isSelected}
                    onChange={() => setField("modalita", value)}
                    className="sr-only"
                    aria-label={label}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>
        {errors.modalita && (
          <FieldError id="modalita-error" message={errors.modalita} />
        )}
      </div>
    </div>
  );
}

// ─── Step 3 — Bio e disponibilità ─────────────────────────────────────────────

function Step3({
  form,
}: {
  form: ReturnType<typeof useFormState<Step3Values>>;
}) {
  const { values, errors, isSubmitting, setField } = form;
  const bioBreveCount = values.bioBreve.length;

  return (
    <div className="space-y-5">
      {/* Bio breve */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="bioBreve"
            className="text-sm font-medium text-text"
          >
            Bio breve
          </label>
          <span
            aria-live="polite"
            className={`text-xs font-medium transition-colors ${
              bioBreveCount > BIO_BREVE_MAX
                ? "text-red-500"
                : bioBreveCount > BIO_BREVE_MAX * 0.9
                  ? "text-accent-600"
                  : "text-text-tertiary"
            }`}
          >
            {bioBreveCount}/{BIO_BREVE_MAX}
          </span>
        </div>
        <textarea
          id="bioBreve"
          aria-label="Bio breve, massimo 200 caratteri"
          aria-invalid={!!errors.bioBreve}
          aria-describedby={errors.bioBreve ? "bio-breve-error" : undefined}
          value={values.bioBreve}
          onChange={(e) => setField("bioBreve", e.target.value)}
          disabled={isSubmitting}
          rows={3}
          placeholder="Presenta te stesso in poche parole ai potenziali pazienti…"
          className={`
            w-full resize-none rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
            bg-bg-subtle transition-all duration-150 outline-none
            focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
            disabled:opacity-60
            ${errors.bioBreve ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
          `}
        />
        {errors.bioBreve && (
          <FieldError id="bio-breve-error" message={errors.bioBreve} />
        )}
      </div>

      {/* Bio completa */}
      <div className="space-y-1.5">
        <label
          htmlFor="bioCompleta"
          className="block text-sm font-medium text-text"
        >
          Bio completa
        </label>
        <textarea
          id="bioCompleta"
          aria-label="Bio completa"
          aria-invalid={!!errors.bioCompleta}
          aria-describedby={
            errors.bioCompleta ? "bio-completa-error" : undefined
          }
          value={values.bioCompleta}
          onChange={(e) => setField("bioCompleta", e.target.value)}
          disabled={isSubmitting}
          rows={5}
          placeholder="Descrivi la tua formazione, esperienza e approccio terapeutico…"
          className={`
            w-full resize-none rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
            bg-bg-subtle transition-all duration-150 outline-none
            focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
            disabled:opacity-60
            ${errors.bioCompleta ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
          `}
        />
        {errors.bioCompleta && (
          <FieldError id="bio-completa-error" message={errors.bioCompleta} />
        )}
      </div>

      {/* Max nuovi pazienti */}
      <div className="space-y-1.5">
        <label
          htmlFor="maxNuoviPazienti"
          className="block text-sm font-medium text-text"
        >
          Nuovi pazienti per settimana{" "}
          <span className="font-normal text-text-tertiary">(opzionale)</span>
        </label>
        <input
          id="maxNuoviPazienti"
          type="number"
          min={1}
          max={50}
          aria-label="Numero massimo di nuovi pazienti per settimana"
          aria-invalid={!!errors.maxNuoviPazienti}
          aria-describedby={
            errors.maxNuoviPazienti ? "pazienti-error" : undefined
          }
          value={values.maxNuoviPazienti}
          onChange={(e) => setField("maxNuoviPazienti", e.target.value)}
          disabled={isSubmitting}
          placeholder="es. 3"
          className={`
            w-32 rounded-xl border px-4 py-3 text-sm text-text placeholder:text-text-tertiary
            bg-bg-subtle transition-all duration-150 outline-none
            focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-primary-100
            disabled:opacity-60
            ${errors.maxNuoviPazienti ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-border"}
          `}
        />
        <p className="text-xs text-text-tertiary">
          Indica quanti nuovi pazienti puoi accogliere ogni settimana.
        </p>
        {errors.maxNuoviPazienti && (
          <FieldError
            id="pazienti-error"
            message={errors.maxNuoviPazienti}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const STEP_HEADINGS = [
  { title: "Crea il tuo account", subtitle: "Inizia il tuo percorso su Synapsy come professionista." },
  { title: "Profilo professionale", subtitle: "Aiutaci a mostrarti ai pazienti più adatti a te." },
  { title: "Bio e disponibilità", subtitle: "L'ultima cosa: presentati e dicci la tua disponibilità." },
];

export default function PsychologistRegisterPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form1 = useFormState<Step1Values>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    numeroAlbo: "",
    regioneAlbo: "",
  });

  const form2 = useFormState<Step2Values>({
    areeTrattate: [],
    approcci: [],
    modalita: "",
  });

  const form3 = useFormState<Step3Values>({
    bioBreve: "",
    bioCompleta: "",
    maxNuoviPazienti: "",
  });

  const isSubmitting =
    form1.isSubmitting || form2.isSubmitting || form3.isSubmitting;

  function goBack() {
    if (currentStep <= 1) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  }

  function goNext() {
    setGlobalError(null);
    let isValid = false;

    if (currentStep === 1) {
      isValid = form1.validate(validateStep1);
    } else if (currentStep === 2) {
      isValid = form2.validate(validateStep2);
    }

    if (!isValid) return;

    setDirection(1);
    setCurrentStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError(null);

    if (currentStep < TOTAL_STEPS) {
      goNext();
      return;
    }

    // Final step
    const isValid = form3.validate(validateStep3);
    if (!isValid) return;

    form1.setSubmitting(true);
    try {
      const result = await signUp.email({
        name: form1.values.name.trim(),
        email: form1.values.email.trim(),
        password: form1.values.password,
        role: "psychologist",
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

      router.push("/dashboard");
    } catch {
      setGlobalError(
        "Si è verificato un errore. Riprova tra qualche istante.",
      );
    } finally {
      form1.setSubmitting(false);
    }
  }

  const heading = STEP_HEADINGS[currentStep - 1];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <>
      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} total={TOTAL_STEPS} />

      {/* Heading */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          {heading.title}
        </h1>
        <p className="mt-1.5 text-text-secondary">{heading.subtitle}</p>
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

      {/* Animated step content */}
      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {currentStep === 1 && <Step1 form={form1} />}
            {currentStep === 2 && <Step2 form={form2} />}
            {currentStep === 3 && <Step3 form={form3} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div
          className={`mt-8 flex gap-3 ${currentStep > 1 ? "justify-between" : "justify-end"}`}
        >
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              aria-label="Torna al passo precedente"
              className="
                flex items-center gap-2 rounded-xl border border-border bg-bg-subtle
                px-5 py-3 text-sm font-medium text-text-secondary
                transition-all duration-150 hover:border-border-strong hover:bg-surface hover:text-text
                disabled:cursor-not-allowed disabled:opacity-60
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
              "
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Indietro
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="
              flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white
              shadow-sm transition-all duration-150
              hover:bg-primary-600 hover:shadow-md
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Registrazione in corso…
              </>
            ) : currentStep < TOTAL_STEPS ? (
              <>
                Avanti
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              "Completa registrazione"
            )}
          </button>
        </div>
      </form>

      {/* Login link */}
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

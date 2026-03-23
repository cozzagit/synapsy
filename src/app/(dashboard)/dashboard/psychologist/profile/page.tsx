"use client";

import { useState } from "react";
import {
  Edit3,
  Check,
  X,
  Copy,
  CheckCheck,
  Award,
  Link2,
  Clock,
  MapPin,
  Video,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type Modality = "online" | "presenziale" | "ibrido";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  color: string;
}

interface AvailabilitySlot {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Mon ... 6=Sun
  hour: number; // 8-20
}

interface ProfileData {
  displayName: string;
  title: string;
  shortBio: string;
  bio: string;
  treatedAreas: string[];
  approaches: string[];
  modality: Modality[];
  sessionDurationMinutes: number;
  sessionPriceEur: number;
  city: string;
  availability: AvailabilitySlot[];
  referralCode: string;
}

const MOCK_PROFILE: ProfileData = {
  displayName: "Dott.ssa Marta Ferretti",
  title: "Psicoterapeuta — Approccio cognitivo-comportamentale",
  shortBio: "Specializzata in ansia, relazioni e sviluppo personale. Approccio caldo, scientifico e orientato ai risultati.",
  bio: "Sono una psicoterapeuta con 8 anni di esperienza clinica. Lavoro principalmente con adulti e giovani adulti che attraversano momenti di difficoltà emotiva, relazionale o professionale. Il mio approccio integra tecniche cognitive-comportamentali con un'attenzione profonda alla persona nella sua interezza. Credo che ogni percorso terapeutico debba essere su misura: porto rigore scientifico e calore umano in ogni seduta.",
  treatedAreas: [
    "Ansia e attacchi di panico",
    "Depressione",
    "Autostima",
    "Relazioni interpersonali",
    "Stress lavorativo",
    "Disturbi del sonno",
    "Lutto e perdita",
  ],
  approaches: ["Cognitivo-comportamentale (CBT)", "Mindfulness-based", "Schema Therapy"],
  modality: ["online", "presenziale"],
  sessionDurationMinutes: 50,
  sessionPriceEur: 80,
  city: "Milano",
  availability: [
    { day: 0, hour: 9 }, { day: 0, hour: 10 }, { day: 0, hour: 11 },
    { day: 0, hour: 15 }, { day: 0, hour: 16 },
    { day: 2, hour: 9 }, { day: 2, hour: 10 },
    { day: 2, hour: 18 }, { day: 2, hour: 19 },
    { day: 4, hour: 14 }, { day: 4, hour: 15 }, { day: 4, hour: 16 },
  ],
  referralCode: "MARTA-SYNAPSY",
};

const MOCK_BADGES: Badge[] = [
  {
    id: "b-1",
    name: "Primo Match",
    description: "Hai completato il tuo primo abbinamento",
    icon: "⭐",
    earnedAt: new Date("2024-10-15"),
    color: "bg-accent-100 text-accent-700",
  },
  {
    id: "b-2",
    name: "Ascoltatore Empatico",
    description: "5 sedute con valutazione 5 stelle",
    icon: "💚",
    earnedAt: new Date("2025-01-20"),
    color: "bg-primary-100 text-primary-700",
  },
  {
    id: "b-3",
    name: "Esploratore",
    description: "Hai raggiunto lo stadio Esploratore",
    icon: "🌱",
    earnedAt: new Date("2024-11-01"),
    color: "bg-secondary-100 text-secondary-700",
  },
];

const DAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8-20

const TREATED_AREAS_OPTIONS = [
  "Ansia e attacchi di panico", "Depressione", "Autostima", "Relazioni interpersonali",
  "Stress lavorativo", "Disturbi del sonno", "Lutto e perdita", "Traumi",
  "Disturbi alimentari", "Adolescenza", "Coppia", "Genitorialità",
];

const APPROACHES_OPTIONS = [
  "Cognitivo-comportamentale (CBT)", "Mindfulness-based", "Schema Therapy",
  "Psicodinamico", "EMDR", "ACT (Acceptance and Commitment Therapy)",
  "Sistemico-relazionale", "Umanistico-esistenziale",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Availability grid
// ---------------------------------------------------------------------------

function AvailabilityGrid({
  slots,
  editing,
  onChange,
}: {
  slots: AvailabilitySlot[];
  editing: boolean;
  onChange: (slots: AvailabilitySlot[]) => void;
}) {
  function isSelected(day: number, hour: number) {
    return slots.some((s) => s.day === day && s.hour === hour);
  }

  function toggle(day: number, hour: number) {
    if (!editing) return;
    if (isSelected(day, hour)) {
      onChange(slots.filter((s) => !(s.day === day && s.hour === hour)));
    } else {
      onChange([...slots, { day: day as AvailabilitySlot["day"], hour }]);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs font-body">
        <thead>
          <tr>
            <th className="w-12 text-text-tertiary font-medium pb-2 text-right pr-2" />
            {DAY_LABELS.map((d) => (
              <th key={d} className="text-center font-semibold text-text-secondary pb-2 px-1 min-w-[40px]">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="text-text-tertiary text-right pr-2 py-0.5 w-12">
                {hour}:00
              </td>
              {DAY_LABELS.map((_, dayIndex) => {
                const selected = isSelected(dayIndex, hour);
                return (
                  <td key={dayIndex} className="px-1 py-0.5 text-center">
                    <button
                      onClick={() => toggle(dayIndex, hour)}
                      disabled={!editing}
                      className={`
                        w-8 h-6 rounded-md transition-colors duration-100
                        ${selected
                          ? "bg-primary-400 border border-primary-500"
                          : "bg-bg-subtle border border-border hover:border-primary-300"
                        }
                        ${editing ? "cursor-pointer" : "cursor-default"}
                      `}
                      aria-label={`${DAY_LABELS[dayIndex]} ${hour}:00 ${selected ? "selezionato" : ""}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag selector
// ---------------------------------------------------------------------------

function TagSelector({
  value,
  options,
  onChange,
  editing,
}: {
  value: string[];
  options: string[];
  onChange: (v: string[]) => void;
  editing: boolean;
}) {
  function toggle(tag: string) {
    if (!editing) return;
    if (value.includes(tag)) {
      onChange(value.filter((v) => v !== tag));
    } else {
      onChange([...value, tag]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(editing ? options : value).map((tag) => {
        const selected = value.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            disabled={!editing}
            className={`
              text-xs font-body px-3 py-1.5 rounded-full border transition-colors
              ${selected
                ? "bg-primary-100 border-primary-300 text-primary-700"
                : "bg-bg-subtle border-border text-text-secondary"
              }
              ${editing ? "hover:border-primary-400 cursor-pointer" : "cursor-default"}
            `}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function ProfileSection({
  title,
  children,
  collapsible = false,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 border-b border-border ${collapsible ? "hover:bg-bg-subtle cursor-pointer" : "cursor-default"} transition-colors`}
      >
        <h2 className="text-sm font-heading font-semibold text-text">{title}</h2>
        {collapsible && (
          open ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(MOCK_PROFILE);
  const [draft, setDraft] = useState<ProfileData>(MOCK_PROFILE);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  function startEditing() {
    setDraft({ ...profile });
    setEditing(true);
  }

  function cancelEditing() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function saveEditing() {
    setProfile({ ...draft });
    setEditing(false);
  }

  function copyReferral() {
    const link = `https://synapsy.it/ref/${profile.referralCode}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const data = editing ? draft : profile;

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Profilo</h1>
          <p className="text-sm font-body text-text-secondary mt-1">
            Gestisci le informazioni visibili ai potenziali pazienti
          </p>
        </div>

        {!editing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary-500 text-white text-sm font-body font-medium hover:bg-primary-600 transition-colors shadow-sm"
          >
            <Edit3 size={15} />
            Modifica
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEditing}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border text-sm font-body text-text-secondary hover:bg-bg-subtle transition-colors"
            >
              <X size={15} />
              Annulla
            </button>
            <button
              onClick={saveEditing}
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary-500 text-white text-sm font-body font-medium hover:bg-primary-600 transition-colors shadow-sm"
            >
              <Check size={15} />
              Salva
            </button>
          </div>
        )}
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-xl px-4 py-2.5 mb-5 text-sm font-body text-accent-800"
        >
          <Edit3 size={14} className="text-accent-600" />
          Stai modificando il tuo profilo. Le modifiche saranno visibili dopo il salvataggio.
        </motion.div>
      )}

      <div className="flex flex-col gap-5">
        {/* Basic info */}
        <ProfileSection title="Informazioni di base">
          <div className="flex flex-col gap-4">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center shrink-0">
                <span className="text-xl font-heading font-bold text-primary-700">MF</span>
              </div>
              {editing && (
                <button className="text-xs font-body font-medium text-primary-600 hover:text-primary-700 border border-primary-300 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                  Cambia foto
                </button>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Nome visualizzato
              </label>
              {editing ? (
                <input
                  value={draft.displayName}
                  onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              ) : (
                <p className="text-sm font-body text-text">{data.displayName}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Titolo professionale
              </label>
              {editing ? (
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              ) : (
                <p className="text-sm font-body text-text">{data.title}</p>
              )}
            </div>

            {/* Short bio */}
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Bio breve (visibile nelle card)
              </label>
              {editing ? (
                <textarea
                  value={draft.shortBio}
                  onChange={(e) => setDraft((d) => ({ ...d, shortBio: e.target.value }))}
                  rows={2}
                  maxLength={160}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              ) : (
                <p className="text-sm font-body text-text">{data.shortBio}</p>
              )}
              {editing && (
                <p className="text-xs font-body text-text-tertiary mt-1 text-right">
                  {draft.shortBio.length}/160 caratteri
                </p>
              )}
            </div>

            {/* Full bio */}
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Presentazione estesa
              </label>
              {editing ? (
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  rows={5}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              ) : (
                <p className="text-sm font-body text-text leading-relaxed">{data.bio}</p>
              )}
            </div>
          </div>
        </ProfileSection>

        {/* Practice settings */}
        <ProfileSection title="Impostazioni studio">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Città
              </label>
              {editing ? (
                <input
                  value={draft.city}
                  onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              ) : (
                <p className="text-sm font-body text-text flex items-center gap-1.5">
                  <MapPin size={14} className="text-text-tertiary" />
                  {data.city}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Durata seduta
              </label>
              {editing ? (
                <select
                  value={draft.sessionDurationMinutes}
                  onChange={(e) => setDraft((d) => ({ ...d, sessionDurationMinutes: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {[45, 50, 60, 90].map((m) => (
                    <option key={m} value={m}>{m} minuti</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-body text-text flex items-center gap-1.5">
                  <Clock size={14} className="text-text-tertiary" />
                  {data.sessionDurationMinutes} minuti
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Prezzo per seduta
              </label>
              {editing ? (
                <input
                  type="number"
                  value={draft.sessionPriceEur}
                  onChange={(e) => setDraft((d) => ({ ...d, sessionPriceEur: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              ) : (
                <p className="text-sm font-body text-text">€{data.sessionPriceEur}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                Modalità
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["online", "presenziale", "ibrido"] as Modality[]).map((m) => {
                  const selected = data.modality.includes(m);
                  const Icon = m === "online" ? Video : m === "presenziale" ? Users : MapPin;
                  const labels: Record<Modality, string> = {
                    online: "Online",
                    presenziale: "In presenza",
                    ibrido: "Ibrido",
                  };
                  return (
                    <button
                      key={m}
                      disabled={!editing}
                      onClick={() => {
                        if (!editing) return;
                        setDraft((d) => ({
                          ...d,
                          modality: selected
                            ? d.modality.filter((x) => x !== m)
                            : [...d.modality, m],
                        }));
                      }}
                      className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? "bg-primary-100 border-primary-300 text-primary-700"
                          : "bg-bg-subtle border-border text-text-secondary"
                      } ${editing ? "cursor-pointer hover:border-primary-400" : "cursor-default"}`}
                    >
                      <Icon size={12} />
                      {labels[m]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Treated areas */}
        <ProfileSection title="Aree trattate">
          <TagSelector
            value={data.treatedAreas}
            options={TREATED_AREAS_OPTIONS}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, treatedAreas: v }))}
          />
          {!editing && data.treatedAreas.length === 0 && (
            <p className="text-sm font-body text-text-tertiary">Nessuna area selezionata</p>
          )}
        </ProfileSection>

        {/* Approaches */}
        <ProfileSection title="Approcci terapeutici">
          <TagSelector
            value={data.approaches}
            options={APPROACHES_OPTIONS}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, approaches: v }))}
          />
        </ProfileSection>

        {/* Availability */}
        <ProfileSection title="Disponibilità settimanale" collapsible>
          {!editing && (
            <p className="text-xs font-body text-text-tertiary mb-3">
              Le celle verdi indicano gli orari in cui sei disponibile per le sedute.
            </p>
          )}
          {editing && (
            <p className="text-xs font-body text-accent-700 bg-accent-50 border border-accent-200 rounded-lg px-3 py-2 mb-3">
              Clicca sulle celle per selezionare / deselezionare gli orari disponibili.
            </p>
          )}
          <AvailabilityGrid
            slots={data.availability}
            editing={editing}
            onChange={(slots) => setDraft((d) => ({ ...d, availability: slots }))}
          />
          <p className="text-xs font-body text-text-tertiary mt-3">
            {data.availability.length} slot selezionati
          </p>
        </ProfileSection>

        {/* Referral */}
        <ProfileSection title="Link referral">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
              <Link2 size={17} className="text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-semibold text-text mb-1">
                Condividi Synapsy con i colleghi
              </p>
              <p className="text-xs font-body text-text-secondary mb-3">
                Per ogni collega psicologo che si registra tramite il tuo link e completa il primo match, ricevi 1 credito gratuito.
              </p>
              <div className="flex items-center gap-2 bg-bg-subtle border border-border rounded-xl px-3 py-2.5">
                <code className="text-xs font-body text-text-secondary flex-1 min-w-0 truncate">
                  https://synapsy.it/ref/{profile.referralCode}
                </code>
                <button
                  onClick={copyReferral}
                  className="flex items-center gap-1.5 text-xs font-body font-medium text-primary-600 hover:text-primary-700 shrink-0 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={13} className="text-primary-500" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copia
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Badges */}
        <ProfileSection title="Badge ottenuti">
          {MOCK_BADGES.length === 0 ? (
            <p className="text-sm font-body text-text-tertiary">
              Non hai ancora ottenuto badge. Continua ad offrire sedute di qualità!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {MOCK_BADGES.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${badge.color.split(" ")[0]} border border-current/10`}
                >
                  <span className="text-2xl" role="img" aria-label={badge.name}>
                    {badge.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-body font-semibold ${badge.color.split(" ")[1]}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs font-body text-text-secondary mt-0.5">
                      {badge.description}
                    </p>
                    <p className="text-xs font-body text-text-tertiary mt-1 flex items-center gap-1">
                      <Award size={10} />
                      Ottenuto il {formatDate(badge.earnedAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ProfileSection>
      </div>
    </div>
  );
}

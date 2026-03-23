import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  psychologistProfiles,
  psychologistBadges,
  badges,
  users,
} from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import {
  problemCategories,
  therapeuticApproaches,
  modalities,
  growthStages,
  growthStageDescriptions,
  badgeTiers,
  badgeTierColors,
} from "@/lib/utils/labels";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function fetchProfile(slug: string) {
  const profile = await db
    .select({
      id: psychologistProfiles.id,
      userId: psychologistProfiles.userId,
      alboNumber: psychologistProfiles.alboNumber,
      alboRegion: psychologistProfiles.alboRegion,
      treatedAreas: psychologistProfiles.treatedAreas,
      therapeuticApproaches: psychologistProfiles.therapeuticApproaches,
      modality: psychologistProfiles.modality,
      bio: psychologistProfiles.bio,
      shortBio: psychologistProfiles.shortBio,
      maxNewPatientsPerWeek: psychologistProfiles.maxNewPatientsPerWeek,
      isVerified: psychologistProfiles.isVerified,
      rankingScore: psychologistProfiles.rankingScore,
      continuityRate: psychologistProfiles.continuityRate,
      growthStage: psychologistProfiles.growthStage,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(psychologistProfiles)
    .innerJoin(users, eq(psychologistProfiles.userId, users.id))
    .where(
      and(
        eq(psychologistProfiles.id, slug),
        eq(psychologistProfiles.isVerified, true),
        isNull(psychologistProfiles.deletedAt),
      ),
    )
    .limit(1);

  return profile[0] ?? null;
}

async function fetchActiveBadges(profileId: string) {
  return db
    .select({
      badgeId: badges.id,
      code: badges.code,
      name: badges.name,
      description: badges.description,
      tier: badges.tier,
      iconName: badges.iconName,
      awardedAt: psychologistBadges.awardedAt,
    })
    .from(psychologistBadges)
    .innerJoin(badges, eq(psychologistBadges.badgeId, badges.id))
    .where(
      and(
        eq(psychologistBadges.psychologistProfileId, profileId),
        eq(psychologistBadges.isActive, true),
      ),
    );
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await fetchProfile(slug);

  if (!profile) {
    return { title: "Profilo non trovato" };
  }

  return {
    title: `Dr. ${profile.userName} — Psicologo su Synapsy`,
    description: profile.shortBio || `Scopri il profilo professionale di ${profile.userName} su Synapsy.`,
    openGraph: {
      title: `Dr. ${profile.userName} — Psicologo su Synapsy`,
      description: profile.shortBio,
      type: "profile",
    },
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InitialsAvatar({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = size === "lg"
    ? "w-24 h-24 text-3xl md:w-32 md:h-32 md:text-4xl"
    : "w-12 h-12 text-lg";

  return (
    <div
      className={`${sizeClass} rounded-2xl flex items-center justify-center font-heading font-bold text-white shrink-0`}
      style={{ background: "linear-gradient(135deg, #5B8A72 0%, #7A6EA0 100%)" }}
    >
      {initials}
    </div>
  );
}

function ModalityBadge({ modality }: { modality: string }) {
  const label = modalities[modality] ?? modality;
  const isOnline = modality === "online";
  const isBoth = modality === "both";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold ${
      isBoth
        ? "bg-secondary-100 text-secondary-700"
        : isOnline
        ? "bg-primary-100 text-primary-700"
        : "bg-accent-100 text-accent-700"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isBoth ? "bg-secondary-500" : isOnline ? "bg-primary-500" : "bg-accent-500"
      }`} />
      {label}
    </span>
  );
}

function GrowthStagePill({ stage }: { stage: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold bg-primary-50 text-primary-700 border border-primary-200">
      <span>🌱</span>
      {growthStages[stage] ?? stage}
    </span>
  );
}

function AreaPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-body font-medium bg-bg-subtle text-text-secondary border border-border hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors">
      {label}
    </span>
  );
}

function ApproachPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-body font-medium bg-secondary-50 text-secondary-700 border border-secondary-200">
      {label}
    </span>
  );
}

function BadgeCard({
  badge,
}: {
  badge: {
    code: string;
    name: string;
    description: string;
    tier: string;
    iconName: string;
  };
}) {
  const tierStyle = badgeTierColors[badge.tier] ?? badgeTierColors.foundation;
  const tierLabel = badgeTiers[badge.tier] ?? badge.tier;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${tierStyle.border} ${tierStyle.bg}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm`}>
        <span className="text-xl" role="img" aria-label={badge.name}>
          {getBadgeEmoji(badge.code)}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-body font-semibold ${tierStyle.text}`}>{badge.name}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-body font-medium ${tierStyle.bg} ${tierStyle.text} border ${tierStyle.border}`}>
            {tierLabel}
          </span>
        </div>
        <p className="text-xs font-body text-text-secondary mt-0.5 leading-relaxed">
          {badge.description}
        </p>
      </div>
    </div>
  );
}

function getBadgeEmoji(code: string): string {
  const map: Record<string, string> = {
    first_match: "⭐",
    continuity_champion: "💚",
    fast_responder: "⚡",
    highly_rated: "🏆",
    referral_master: "🔗",
    verified_professional: "✅",
    top_ranked: "🥇",
    empathic_listener: "👂",
    long_term_care: "🕐",
    community_builder: "👥",
    reliability_badge: "🛡️",
    innovation_badge: "💡",
  };
  return map[code] ?? "🎖️";
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="bg-bg-subtle rounded-2xl p-5 flex flex-col gap-1">
      <p className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-heading font-bold text-text">{value}</p>
      {description && (
        <p className="text-xs font-body text-text-secondary">{description}</p>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;

  const [profile, activeBadges] = await Promise.all([
    fetchProfile(slug),
    fetchProfile(slug).then((p) => (p ? fetchActiveBadges(p.id) : [])),
  ]);

  if (!profile) {
    notFound();
  }

  const continuityPercent = Math.round(profile.continuityRate * 100);
  const stageLabel = growthStages[profile.growthStage] ?? profile.growthStage;
  const stageDescription = growthStageDescriptions[profile.growthStage] ?? "";

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Top nav strip ── */}
      <nav className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-lg text-text">
            Synapsy
          </Link>
          <Link
            href={`/questionnaire?ref=${profile.id}`}
            className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-body font-semibold hover:bg-primary-700 transition-colors"
          >
            Inizia il questionario
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* ── Hero card ── */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
          {/* Warm gradient banner */}
          <div
            className="h-28 md:h-36"
            style={{
              background:
                "linear-gradient(135deg, #EEF4F0 0%, #EAE7F3 50%, #F5EDE8 100%)",
            }}
          />

          <div className="px-6 md:px-8 pb-8">
            {/* Avatar + verified badge */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 md:-mt-16 mb-5">
              <div className="relative w-fit">
                <InitialsAvatar name={profile.userName} size="lg" />
                {profile.isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center"
                    title="Professionista verificato"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="sm:mb-1 flex flex-wrap gap-2">
                <ModalityBadge modality={profile.modality} />
                <GrowthStagePill stage={profile.growthStage} />
              </div>
            </div>

            {/* Name + credentials */}
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text mb-1">
              Dr. {profile.userName}
            </h1>
            <p className="text-sm font-body text-text-secondary mb-1">
              Psicologo — Albo n. {profile.alboNumber} ({profile.alboRegion})
            </p>
            {profile.shortBio && (
              <p className="mt-4 text-base font-body text-text-secondary leading-relaxed max-w-2xl">
                {profile.shortBio}
              </p>
            )}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: bio + areas + approaches */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Full bio */}
            {profile.bio && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-base font-heading font-semibold text-text mb-4">
                  Chi sono
                </h2>
                <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Treated areas */}
            {profile.treatedAreas.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-base font-heading font-semibold text-text mb-4">
                  Aree di intervento
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.treatedAreas.map((area) => (
                    <AreaPill
                      key={area}
                      label={problemCategories[area] ?? area}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Therapeutic approaches */}
            {profile.therapeuticApproaches.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-base font-heading font-semibold text-text mb-4">
                  Approcci terapeutici
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.therapeuticApproaches.map((approach) => (
                    <ApproachPill
                      key={approach}
                      label={therapeuticApproaches[approach] ?? approach}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {activeBadges.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-base font-heading font-semibold text-text mb-4">
                  Riconoscimenti ottenuti
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeBadges.map((badge) => (
                    <BadgeCard key={badge.badgeId} badge={badge} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: quality indicators + CTA */}
          <div className="flex flex-col gap-6">
            {/* Quality metrics */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-base font-heading font-semibold text-text mb-4">
                Indicatori di qualità
              </h2>
              <div className="flex flex-col gap-3">
                <MetricCard
                  label="Tasso di continuità"
                  value={continuityPercent > 0 ? `${continuityPercent}%` : "N/D"}
                  description="Pazienti che continuano il percorso"
                />
                <MetricCard
                  label="Fase di crescita"
                  value={stageLabel}
                  description={stageDescription}
                />
                <MetricCard
                  label="Modalità"
                  value={modalities[profile.modality] ?? profile.modality}
                />
                {profile.maxNewPatientsPerWeek > 0 && (
                  <MetricCard
                    label="Disponibilità"
                    value={`${profile.maxNewPatientsPerWeek} posti/sett.`}
                    description="Nuovi pazienti accettati a settimana"
                  />
                )}
              </div>
            </div>

            {/* CTA card */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "linear-gradient(135deg, #EEF4F0 0%, #EAE7F3 100%)",
                border: "1px solid #D4E4DC",
              }}
            >
              <div>
                <h3 className="font-heading font-bold text-text text-lg mb-1">
                  Inizia il tuo percorso
                </h3>
                <p className="text-sm font-body text-text-secondary leading-relaxed">
                  Compila il questionario — gratuito e senza impegno — per vedere se c&apos;è compatibilità.
                </p>
              </div>
              <Link
                href={`/questionnaire?ref=${profile.id}`}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary-600 text-white font-body font-semibold text-sm hover:bg-primary-700 transition-colors shadow-sm"
              >
                Inizia il questionario
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-xs font-body text-text-secondary text-center">
                Nessun pagamento richiesto per iniziare
              </p>
            </div>

            {/* Trust signals */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
              <h3 className="text-sm font-heading font-semibold text-text mb-3">
                Perché Synapsy?
              </h3>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Professionisti verificati e iscritti all'Albo",
                  "Matching basato sulle tue esigenze specifiche",
                  "Prima sessione conoscitiva inclusa",
                  "Nessun vincolo contrattuale",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-body text-text-secondary">
                    <span className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B8A72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-body text-text-secondary">
            © {new Date().getFullYear()} Synapsy. Tutti i diritti riservati.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm font-body text-text-secondary hover:text-text transition-colors">
              Privacy
            </Link>
            <Link href="/termini" className="text-sm font-body text-text-secondary hover:text-text transition-colors">
              Termini
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

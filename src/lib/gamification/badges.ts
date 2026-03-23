/**
 * Synapsy Badge System
 *
 * Badges are earned, not purchased. They signal quality to users.
 *
 * Tier 1 — Foundation (earned by activity)
 * Tier 2 — Quality (earned by outcomes)
 * Tier 3 — Network (earned by contribution)
 */

import { db } from "@/lib/db";
import {
  badges,
  psychologistBadges,
  psychologistProfiles,
  matchSelections,
  credits,
} from "@/lib/db/schema";
import { eq, and, sql, count } from "drizzle-orm";

export interface BadgeDefinition {
  code: string;
  name: string;
  description: string;
  tier: "foundation" | "quality" | "network";
  iconName: string;
  evaluate: (psychologistProfileId: string) => Promise<boolean>;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Tier 1 — Foundation
  {
    code: "profilo_verificato",
    name: "Profilo Verificato",
    description: "Profilo completo e credenziali verificate",
    tier: "foundation",
    iconName: "shield-check",
    evaluate: async (pid) => {
      const p = await db.query.psychologistProfiles.findFirst({
        where: eq(psychologistProfiles.id, pid),
      });
      return !!p?.isVerified;
    },
  },
  {
    code: "risposta_rapida",
    name: "Risposta Rapida",
    description: "Tempo medio di risposta sotto le 4 ore",
    tier: "foundation",
    iconName: "zap",
    evaluate: async (pid) => {
      const p = await db.query.psychologistProfiles.findFirst({
        where: eq(psychologistProfiles.id, pid),
      });
      return (p?.averageResponseTime ?? 99) <= 4;
    },
  },
  // Tier 2 — Quality
  {
    code: "alta_continuita",
    name: "Alta Continuità",
    description: "70%+ dei pazienti continua dopo la call conoscitiva",
    tier: "quality",
    iconName: "heart-handshake",
    evaluate: async (pid) => {
      const stats = await db
        .select({
          total: sql<number>`count(*) filter (where ${matchSelections.status} in ('continued', 'not_continued'))`,
          continued: sql<number>`count(*) filter (where ${matchSelections.status} = 'continued')`,
        })
        .from(matchSelections)
        .where(eq(matchSelections.psychologistProfileId, pid));

      const total = Number(stats[0]?.total ?? 0);
      const continued = Number(stats[0]?.continued ?? 0);
      return total >= 10 && continued / total >= 0.7;
    },
  },
  {
    code: "relazioni_durature",
    name: "Relazioni Durature",
    description: "Relazioni terapeutiche medie oltre 6 mesi",
    tier: "quality",
    iconName: "timer",
    evaluate: async (pid) => {
      // Simplified: check if there are patients who continued 6+ months ago
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const longRelations = await db
        .select({ count: count() })
        .from(matchSelections)
        .where(
          and(
            eq(matchSelections.psychologistProfileId, pid),
            eq(matchSelections.status, "continued"),
            sql`${matchSelections.createdAt} <= ${sixMonthsAgo}`
          )
        );

      return Number(longRelations[0]?.count ?? 0) >= 5;
    },
  },
  // Tier 3 — Network
  {
    code: "ambasciatore",
    name: "Ambasciatore",
    description: "Ha portato 10+ utenti alla piattaforma tramite referral",
    tier: "network",
    iconName: "megaphone",
    evaluate: async (pid) => {
      const referralCount = await db
        .select({ count: count() })
        .from(credits)
        .where(eq(credits.psychologistProfileId, pid));

      // Credits are earned when referred users choose OTHER psychologists
      return Number(referralCount[0]?.count ?? 0) >= 10;
    },
  },
  {
    code: "mentore_della_rete",
    name: "Mentore della Rete",
    description:
      "5+ utenti referenziati hanno scelto altri professionisti (il sistema funziona!)",
    tier: "network",
    iconName: "users",
    evaluate: async (pid) => {
      const creditCount = await db
        .select({ count: count() })
        .from(credits)
        .where(
          and(
            eq(credits.psychologistProfileId, pid),
            eq(credits.status, "used")
          )
        );

      return Number(creditCount[0]?.count ?? 0) >= 5;
    },
  },
];

/**
 * Evaluate all badges for a psychologist and award/revoke as needed
 */
export async function evaluateBadges(
  psychologistProfileId: string
): Promise<{ awarded: string[]; revoked: string[] }> {
  const awarded: string[] = [];
  const revoked: string[] = [];

  for (const def of BADGE_DEFINITIONS) {
    const earned = await def.evaluate(psychologistProfileId);

    // Get or create badge record
    let badge = await db.query.badges.findFirst({
      where: eq(badges.code, def.code),
    });

    if (!badge) {
      [badge] = await db
        .insert(badges)
        .values({
          code: def.code,
          name: def.name,
          description: def.description,
          tier: def.tier,
          iconName: def.iconName,
          criteria: {},
        })
        .returning();
    }

    // Check current assignment
    const currentAssignment = await db.query.psychologistBadges.findFirst({
      where: and(
        eq(psychologistBadges.psychologistProfileId, psychologistProfileId),
        eq(psychologistBadges.badgeId, badge.id)
      ),
    });

    if (earned && (!currentAssignment || !currentAssignment.isActive)) {
      // Award badge
      if (currentAssignment) {
        await db
          .update(psychologistBadges)
          .set({ isActive: true, revokedAt: null })
          .where(eq(psychologistBadges.id, currentAssignment.id));
      } else {
        await db.insert(psychologistBadges).values({
          psychologistProfileId,
          badgeId: badge.id,
          awardedAt: new Date(),
          isActive: true,
        });
      }
      awarded.push(def.code);
    } else if (!earned && currentAssignment?.isActive) {
      // Revoke badge (with 30-day grace period — simplified here)
      await db
        .update(psychologistBadges)
        .set({ isActive: false, revokedAt: new Date() })
        .where(eq(psychologistBadges.id, currentAssignment.id));
      revoked.push(def.code);
    }
  }

  return { awarded, revoked };
}

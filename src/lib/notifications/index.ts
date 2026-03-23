import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import * as templates from "@/lib/email/templates";

// ─── Types ─────────────────────────────────────────────────────────────────

type NotificationType =
  | "new_case"
  | "candidacy_accepted"
  | "match_found"
  | "call_reminder"
  | "post_call_questionnaire"
  | "payment_due"
  | "payment_received"
  | "credit_earned"
  | "badge_awarded"
  | "penalty_applied"
  | "ranking_updated"
  | "welcome"
  | "system";

interface NotifyParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  email?: {
    to: string;
    subject: string;
    html: string;
  };
}

// ─── Core notify ───────────────────────────────────────────────────────────

export async function notify(params: NotifyParams): Promise<void> {
  await db.insert(notifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link,
  });

  if (params.email) {
    await sendEmail(
      params.email.to,
      params.email.subject,
      params.email.html
    );
  }
}

// ─── Convenience helpers ───────────────────────────────────────────────────

export async function notifyNewCase(
  psychologistUserId: string,
  psychologistEmail: string,
  psychologistName: string,
  caseInfo: { problemArea: string; compatibilityScore: number; caseId: string }
): Promise<void> {
  const { subject, html } = templates.newCaseAvailable(
    psychologistName,
    caseInfo.problemArea,
    caseInfo.compatibilityScore
  );

  await notify({
    userId: psychologistUserId,
    type: "new_case",
    title: "Nuovo caso compatibile disponibile",
    message: `Un nuovo caso nell'area "${caseInfo.problemArea}" con ${caseInfo.compatibilityScore}% di compatibilità è disponibile.`,
    link: `/psicologo/casi/${caseInfo.caseId}`,
    email: { to: psychologistEmail, subject, html },
  });
}

export async function notifyMatchFound(
  userId: string,
  userEmail: string,
  userName: string,
  matchCount: number
): Promise<void> {
  const { subject, html } = templates.matchFound(userName, matchCount);

  await notify({
    userId,
    type: "match_found",
    title: "Professionisti trovati per te",
    message: `${matchCount === 1 ? "Un professionista si è candidato" : `${matchCount} professionisti si sono candidati`} per il tuo caso.`,
    link: "/dashboard",
    email: { to: userEmail, subject, html },
  });
}

export async function notifyCandidacyAccepted(
  userId: string,
  userEmail: string,
  userName: string,
  psychologistName: string
): Promise<void> {
  const { subject, html } = templates.candidacyAccepted(
    userName,
    psychologistName
  );

  await notify({
    userId,
    type: "candidacy_accepted",
    title: "Uno psicologo si è candidato per te",
    message: `Dott. ${psychologistName} ha visto il tuo caso e vuole supportarti. Consulta il suo profilo.`,
    link: "/dashboard",
    email: { to: userEmail, subject, html },
  });
}

export async function notifyCallReminder(
  userId: string,
  userEmail: string,
  name: string,
  otherName: string,
  scheduledAt: Date
): Promise<void> {
  const timeStr = scheduledAt.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { subject, html } = templates.callReminder(name, otherName, scheduledAt);

  await notify({
    userId,
    type: "call_reminder",
    title: "Promemoria: call conoscitiva domani",
    message: `La tua call con ${otherName} è programmata per domani alle ${timeStr}.`,
    link: "/dashboard",
    email: { to: userEmail, subject, html },
  });
}

export async function notifyPostCallQuestionnaire(
  userId: string,
  userEmail: string,
  name: string,
  matchSelectionId: string
): Promise<void> {
  const { subject, html } = templates.postCallQuestionnaireReminder(name);

  await notify({
    userId,
    type: "post_call_questionnaire",
    title: "Compila il questionario post-call",
    message: "La tua call si è conclusa. Compila il breve questionario per aiutarci a migliorare.",
    link: `/questionario?selectionId=${matchSelectionId}`,
    email: { to: userEmail, subject, html },
  });
}

export async function notifyPaymentDue(
  psychologistUserId: string,
  email: string,
  name: string,
  amount: number,
  type: string
): Promise<void> {
  const { subject, html } = templates.paymentDue(name, amount, type);
  const amountFormatted = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);

  await notify({
    userId: psychologistUserId,
    type: "payment_due",
    title: "Pagamento in scadenza",
    message: `Hai un pagamento in sospeso di ${amountFormatted} per: ${type}.`,
    link: "/psicologo/pagamenti",
    email: { to: email, subject, html },
  });
}

export async function notifyCreditEarned(
  psychologistUserId: string,
  email: string,
  name: string
): Promise<void> {
  const { subject, html } = templates.creditEarned(name);

  await notify({
    userId: psychologistUserId,
    type: "credit_earned",
    title: "Hai guadagnato un credito!",
    message: "Un nuovo credito è stato aggiunto al tuo account. Usalo per sbloccare un nuovo caso.",
    link: "/psicologo/crediti",
    email: { to: email, subject, html },
  });
}

export async function notifyBadgeAwarded(
  psychologistUserId: string,
  email: string,
  name: string,
  badgeName: string
): Promise<void> {
  const { subject, html } = templates.badgeAwarded(name, badgeName);

  await notify({
    userId: psychologistUserId,
    type: "badge_awarded",
    title: "Nuovo badge conquistato!",
    message: `Hai sbloccato il badge "${badgeName}". È ora visibile sul tuo profilo.`,
    link: "/psicologo/profilo",
    email: { to: email, subject, html },
  });
}

export async function notifyWelcomeUser(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const { subject, html } = templates.welcomeUser(name);

  await notify({
    userId,
    type: "welcome",
    title: "Benvenuto/a su Synapsy!",
    message: "Il tuo account è pronto. Inizia descrivendo il tuo bisogno per trovare il professionista giusto.",
    link: "/dashboard",
    email: { to: email, subject, html },
  });
}

export async function notifyWelcomePsychologist(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const { subject, html } = templates.welcomePsychologist(name);

  await notify({
    userId,
    type: "welcome",
    title: "Benvenuto nella rete Synapsy!",
    message: "Il tuo profilo professionale è stato creato. Completa il profilo per iniziare a ricevere casi.",
    link: "/psicologo/profilo",
    email: { to: email, subject, html },
  });
}

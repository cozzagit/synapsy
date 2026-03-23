import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Synapsy <noreply@synapsy.vibecanyon.com>";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIP] To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (error) {
    console.error("Email send error:", error);
  }
}

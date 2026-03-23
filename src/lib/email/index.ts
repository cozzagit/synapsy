import { Resend } from "resend";

const FROM_EMAIL =
  process.env.FROM_EMAIL || "Synapsy <noreply@synapsy.vibecanyon.com>";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const client = getResend();
  if (!client) {
    console.log(`[EMAIL SKIP] To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    await client.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (error) {
    console.error("Email send error:", error);
  }
}

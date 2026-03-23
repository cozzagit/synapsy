import { NextRequest, NextResponse } from "next/server";
import { notifyWelcomeUser, notifyWelcomePsychologist } from "@/lib/notifications";

/**
 * POST /api/auth/hooks
 * Called manually from registration pages after successful Better Auth signup.
 * Triggers post-registration side effects (welcome notifications, etc.).
 *
 * Body: { userId: string, role: "user" | "psychologist", email: string, name: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      role,
      email,
      name,
    }: {
      userId: string;
      role: string;
      email: string;
      name: string;
    } = body;

    if (!userId || !role || !email || !name) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "userId, role, email e name sono obbligatori" } },
        { status: 400 }
      );
    }

    if (role === "user") {
      await notifyWelcomeUser(userId, email, name);
    } else if (role === "psychologist") {
      await notifyWelcomePsychologist(userId, email, name);
    }
    // Unknown roles receive no notification — not an error

    return NextResponse.json(
      { data: { handled: true }, meta: { version: "v1" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth hook error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore." } },
      { status: 500 }
    );
  }
}

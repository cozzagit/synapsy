import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

interface ReadBody {
  notificationId?: string;
  all?: boolean;
}

/**
 * POST /api/notifications/read
 * Mark one or all notifications as read for the current user.
 *
 * Body options:
 *   { notificationId: string } — marks a single notification
 *   { all: true }              — marks all notifications for the user
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body: ReadBody = await request.json();

    if (!body.notificationId && !body.all) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Fornisci notificationId oppure all: true",
          },
        },
        { status: 400 }
      );
    }

    if (body.all) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    } else if (body.notificationId) {
      // Scope the update to the userId to prevent cross-user manipulation
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, body.notificationId),
            eq(notifications.userId, userId)
          )
        );
    }

    return NextResponse.json(
      { data: { success: true }, meta: { version: "v1" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notification read error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno" } },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and, sql } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * GET /api/notifications
 * Returns the 50 most recent notifications for the current user
 * with an unread count.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [userNotifications, unreadResult] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(50),

      db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.isRead, false)
          )
        ),
    ]);

    const unreadCount = Number(unreadResult[0]?.count ?? 0);

    return NextResponse.json(
      {
        data: userNotifications,
        meta: {
          unreadCount,
          total: userNotifications.length,
          version: "v1",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno" } },
      { status: 500 }
    );
  }
}

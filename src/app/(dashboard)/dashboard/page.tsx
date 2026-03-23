import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

/**
 * Dashboard index — reads the real auth session and redirects to the
 * appropriate role-specific sub-dashboard.
 */
export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role ?? "user";

  if (role === "psychologist") {
    redirect("/dashboard/psychologist");
  }

  redirect("/dashboard/user");
}

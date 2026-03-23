import { redirect } from "next/navigation";

/**
 * Dashboard index — redirects to the appropriate role-specific dashboard.
 * In production, replace the hardcoded role with real auth session data.
 */
export default function DashboardPage() {
  // TODO: read user role from auth session
  // const session = await getSession();
  // const role = session?.user?.role ?? "psychologist";

  const role = "psychologist"; // mock

  if (role === "psychologist") {
    redirect("/dashboard/psychologist");
  }

  // Future: patient role
  // if (role === "patient") redirect("/dashboard/patient");

  redirect("/dashboard/psychologist");
}

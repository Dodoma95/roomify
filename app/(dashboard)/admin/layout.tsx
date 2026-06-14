import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN"].includes(r))) {
    redirect("/places");
  }

  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-6">
        <AdminNav />
      </div>
      <div>{children}</div>
    </div>
  );
}

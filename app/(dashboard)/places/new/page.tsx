import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { PlaceFormWizard } from "@/components/places/PlaceFormWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPlacePage() {
  const user = await getSessionUser();

  if (!user || user.roles.length === 0) {
    redirect("/places");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/places"
          className="inline-flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] transition-colors duration-150 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux espaces
        </Link>
        <h1 className="text-[22px] font-semibold text-[#222222]">
          Ajouter un espace
        </h1>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Votre espace sera soumis à validation avant publication.
        </p>
      </div>
      <PlaceFormWizard />
    </div>
  );
}

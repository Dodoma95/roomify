"use client";

import { useState } from "react";
import { ProfileNav, ProfileSection as ProfileSectionType } from "@/components/profile/ProfileNav";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { BookingsSection } from "@/components/profile/BookingsSection";
import { PlacesSection } from "@/components/profile/PlacesSection";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import { Role } from "@/types/user";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileClientProps {
  initialProfile: ProfileData;
  roles: Role[];
}

export function ProfileClient({ initialProfile, roles }: ProfileClientProps) {
  const [activeSection, setActiveSection] = useState<ProfileSectionType>("profile");
  const isOwner = roles.some((r) => (["OWNER", "ADMIN", "SUPER_ADMIN"] as Role[]).includes(r));

  return (
    <div className="flex gap-10">
      <ProfileNav
        active={activeSection}
        onSelect={setActiveSection}
        isOwner={isOwner}
      />
      <main className="flex-1 min-w-0 pb-12">
        {activeSection === "profile"  && <ProfileSection initialData={initialProfile} />}
        {activeSection === "bookings" && <BookingsSection />}
        {activeSection === "places"   && isOwner && <PlacesSection />}
        {activeSection === "danger"   && <DeleteAccountSection />}
      </main>
    </div>
  );
}

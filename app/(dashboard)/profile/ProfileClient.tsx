"use client";

import { useState } from "react";
import { ProfileNav, ProfileSection as ProfileSectionType } from "@/components/profile/ProfileNav";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { BookingsSection } from "@/components/profile/BookingsSection";
import { PlacesSection } from "@/components/profile/PlacesSection";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import { Role } from "@/types/user";
import { buildAvatarSrc } from "@/lib/avatar";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
}

interface ProfileClientProps {
  initialProfile: ProfileData;
  roles: Role[];
  userId: string;
}

export function ProfileClient({ initialProfile, roles, userId }: ProfileClientProps) {
  const [activeSection, setActiveSection] = useState<ProfileSectionType>("profile");
  const isOwner = roles.some((r) => (["OWNER", "ADMIN", "SUPER_ADMIN"] as Role[]).includes(r));
  const avatarSrc = initialProfile.avatarUrl ? buildAvatarSrc(userId) : undefined;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-10">
      <ProfileNav
        active={activeSection}
        onSelect={setActiveSection}
        isOwner={isOwner}
      />
      <main className="flex-1 min-w-0 pb-12">
        {activeSection === "profile"  && <ProfileSection initialData={initialProfile} userId={userId} />}
        {activeSection === "bookings" && <BookingsSection avatarSrc={avatarSrc} firstName={initialProfile.firstName} lastName={initialProfile.lastName} />}
        {activeSection === "places"   && isOwner && <PlacesSection />}
        {activeSection === "danger"   && <DeleteAccountSection />}
      </main>
    </div>
  );
}

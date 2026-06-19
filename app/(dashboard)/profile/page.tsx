import {getSessionUser} from "@/lib/auth/session";
import {getMe} from "@/lib/api/auth";
import {ProfileClient} from "./ProfileClient";

export default async function ProfilePage() {
    const user = await getSessionUser();

    let initialProfile = {
        firstName: user!.name.split(" ")[0] ?? "",
        lastName: user!.name.split(" ").slice(1).join(" "),
        email: user!.email,
        avatarUrl: undefined as string | undefined,
        description: undefined as string | undefined,
    };

    try {
        const me = await getMe(user!.token);
        initialProfile = {
            firstName: me.firstName,
            lastName: me.lastName,
            email: me.email,
            avatarUrl: me.avatarUrl,
            description: me.description,
        };
    } catch {
        // fallback to session data parsed above
    }

    return <ProfileClient initialProfile={initialProfile} roles={user!.roles} userId={user!.id}/>;
}

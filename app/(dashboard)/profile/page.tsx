import {getSessionUser} from "@/lib/auth/session";
import {getMe} from "@/lib/api/auth";
import {ProfileClient} from "./ProfileClient";

export default async function ProfilePage() {
    const user = await getSessionUser();

    let initialProfile = {
        firstName: user!.name.split(" ")[0] ?? "",
        lastName: user!.name.split(" ").slice(1).join(" "),
        email: user!.email,
    };

    try {
        const me = await getMe(user!.token);
        initialProfile = {firstName: me.firstName, lastName: me.lastName, email: me.email};
    } catch {
        // fallback to session data parsed above
    }

    return <ProfileClient initialProfile={initialProfile} roles={user!.roles}/>;
}

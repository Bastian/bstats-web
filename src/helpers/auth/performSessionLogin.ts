import { getCookie } from "$helpers/getCookie";
import type { UserCredential } from "firebase/auth";

export async function performSessionLogin(
    userCredential: UserCredential
): Promise<void> {
    const idToken = await userCredential.user.getIdToken();
    const csrfToken = getCookie("csrfToken");

    await fetch("/sessionLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idToken,
            csrfToken,
        }),
    });
}

import { getCookie } from "$helpers/getCookie";
import type firebase from "firebase/app";

export async function performSessionLogin(
    userCredential: firebase.auth.UserCredential
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
    window.location.assign("/");
}

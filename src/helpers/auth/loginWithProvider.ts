import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider,
} from "firebase/auth";
import { performSessionLogin } from "./performSessionLogin";

export type LoginProvider = "google" | "github" | "twitter";

export async function loginWithProvider(
    providerName: LoginProvider
): Promise<void> {
    let provider = null;
    switch (providerName) {
        case "google":
            provider = new GoogleAuthProvider();
            break;
        case "github":
            provider = new GithubAuthProvider();
            break;
        case "twitter":
            provider = new TwitterAuthProvider();
            break;
    }
    const auth = getAuth();
    const userCredential = await signInWithPopup(auth, provider);

    await performSessionLogin(userCredential);
}

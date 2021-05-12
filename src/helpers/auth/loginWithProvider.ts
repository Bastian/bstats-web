import firebase from "firebase/app/dist/index.cjs.js";
import { performSessionLogin } from "./performSessionLogin";

export type LoginProvider = "google" | "github" | "twitter";

export async function loginWithProvider(
    providerName: LoginProvider
): Promise<void> {
    let provider = null;
    switch (providerName) {
        case "google":
            provider = new firebase.auth.GoogleAuthProvider();
            break;
        case "github":
            provider = new firebase.auth.GithubAuthProvider();
            break;
        case "twitter":
            provider = new firebase.auth.TwitterAuthProvider();
            break;
    }
    const userCredential = await firebase.auth().signInWithPopup(provider);

    await performSessionLogin(userCredential);
}

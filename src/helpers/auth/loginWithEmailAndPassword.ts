import firebase from "firebase/app/dist/index.cjs.js";
import { performSessionLogin } from "./performSessionLogin";

export type LoginProvider = "google" | "github" | "twitter";

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<void> {
    const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

    await performSessionLogin(userCredential);
}

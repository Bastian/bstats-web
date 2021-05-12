import firebase from "firebase/app/dist/index.cjs.js";
import { performSessionLogin } from "./performSessionLogin";

export type LoginProvider = "google" | "github" | "twitter";

export async function registerWithEmailAndPassword(
    email: string,
    password: string
): Promise<void> {
    const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

    userCredential.user.sendEmailVerification();

    await performSessionLogin(userCredential);
}

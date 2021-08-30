import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { performSessionLogin } from "./performSessionLogin";

export type LoginProvider = "google" | "github" | "twitter";

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<void> {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    await performSessionLogin(userCredential);
}

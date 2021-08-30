import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { performSessionLogin } from "./performSessionLogin";

export async function registerWithEmailAndPassword(
    email: string,
    password: string
): Promise<void> {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    sendEmailVerification(userCredential.user);

    await performSessionLogin(userCredential);
}

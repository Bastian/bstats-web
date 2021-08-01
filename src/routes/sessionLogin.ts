import type { RequestHandler } from "@sveltejs/kit";
import * as cookie from "cookie";
// import { auth } from "../firebaseAdmin";
//
// export const post: RequestHandler = async (req) => {
//     // const admin = await import('firebase-admin');
//     const cookies = cookie.parse(req.headers.cookie || "");
//
//     // Get the ID token passed and the CSRF token.
//     const { idToken, csrfToken } = req.body as unknown as {
//         idToken?: string;
//         csrfToken?: string;
//     };
//
//     // Guard against CSRF attacks.
//     if (csrfToken !== cookies.csrfToken) {
//         return {
//             status: 401,
//             body: "UNAUTHORIZED REQUEST!",
//         };
//     }
//
//     // Set session expiration to 5 days.
//     const expiresIn = 60 * 60 * 24 * 5 * 1000;
//
//     const decodedIdToken = await auth.verifyIdToken(idToken);
//
//     if (!(new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60)) {
//         // A user that was not recently signed in is trying to set a session
//         // cookie. To guard against ID token theft, require re-authentication.
//         return {
//             status: 401,
//             body: "Recent sign in required!",
//         };
//     }
//
//     // Create the session cookie. This will also verify the ID token in the
//     // process. The session cookie will have the same claims as the ID token.
//     const sessionCookie = await auth.createSessionCookie(idToken, {
//         expiresIn,
//     });
//
//     const options = { maxAge: expiresIn, httpOnly: true, secure: true };
//     return {
//         status: 200,
//         headers: {
//             "Set-Cookie": cookie.serialize("session", sessionCookie, options),
//         },
//         body: { status: "success" },
//     };
// };

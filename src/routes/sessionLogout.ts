import type { RequestHandler } from "@sveltejs/kit";
import * as cookie from "cookie";
import { auth } from "../firebaseAdmin";

export const get: RequestHandler = async (req) => {
    const cookies = cookie.parse(req.headers.cookie || "");

    const sessionCookie = cookies.session || "";
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);

    await auth.revokeRefreshTokens(decodedClaims.sub);
    return {
        status: 307,
        headers: {
            "Set-Cookie": cookie.serialize("session", "", {
                expires: new Date(2000, 0, 0),
                secure: true,
                httpOnly: true,
            }),
            Location: "/",
        },
        body: "",
    };
};

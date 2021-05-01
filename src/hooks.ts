import * as dotenv from "dotenv";
dotenv.config();

import "./global.css";
import type {GetContext, GetSession, Handle} from "@sveltejs/kit";
import * as cookie from "cookie";
import * as crypto from "crypto";
import * as fs from "fs";
import { auth } from "./firebaseAdmin";

const {API_BASE_URL} = process.env;

let firebaseConfig: any = null;
async function getFirebaseConfig() {
    if (firebaseConfig) {
        return firebaseConfig;
    }
    firebaseConfig = JSON.parse(fs.readFileSync("firebase-config.json", "utf8"));
}

export const getContext: GetContext = async (req) => {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionCookie = cookies.session;

    let decodedClaims = null;
    if (sessionCookie) {
        try {
            decodedClaims = await auth
                .verifySessionCookie(sessionCookie, true);
        } catch (e) {
            console.log(e);
        }
    }

    return { decodedClaims };
};

export const getSession: GetSession = async ({ context }) => {
    return {
        API_BASE_URL,
        firebaseConfig: await getFirebaseConfig(),
        user: context.decodedClaims
    };
};

export const handle: Handle = async ({request, render}) => {
    const response = await render(request);
    if (!response) {
        return undefined;
    }
    const cookies = cookie.parse(request.headers.cookie || "");

    const headers = { ...response.headers };

    // If no csrf token is set, we create one and set it as a cookie
    if (!cookies.csrfToken) {
        headers["Set-Cookie"] = cookie.serialize(
            "csrfToken",
            crypto.randomBytes(64).toString("hex")
        );
    }

    return { ...response, headers };
};

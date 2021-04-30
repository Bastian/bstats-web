import * as dotenv from 'dotenv';
import admin from "firebase-admin";

dotenv.config();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${process.env.FIREBASE_DATABASE_NAME}.firebaseio.com`,
    });
}

const firebase = admin;
const auth = admin.auth();

export { firebase, auth };

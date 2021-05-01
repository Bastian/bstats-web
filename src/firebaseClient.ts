
const firebasePromise: Promise<any> =
    import("firebase/app/dist/index.cjs.js")
        .then(async (firebase) => {
            await import("firebase/auth/dist/index.cjs.js");
            return firebase;
        });

export { firebasePromise };

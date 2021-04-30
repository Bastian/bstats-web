import firebase from "firebase/app/dist/index.cjs.js";

export type LoginProvider = 'google' | 'github' | 'twitter';

export async function loginWithProvider(providerName: LoginProvider) {
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
    const result = await firebase.auth().signInWithPopup(provider);

    const idToken = await result.user.getIdToken();
    const csrfToken = getCookie('csrfToken')

    await fetch("/sessionLogin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idToken, csrfToken
        })
    });

    await firebase.auth().signOut();
    window.location.assign("/");
}

function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

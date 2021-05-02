<script context="module" lang="ts">
    let initialized = false;
</script>

<script lang="ts">
    import firebase from "firebase/app/dist/index.cjs.js";
    import "firebase/auth/dist/index.cjs.js";
    import { browser } from "$app/env";
    import { session } from "$app/stores";

    const { firebaseConfig } = $session;

    if (browser && !initialized && firebaseConfig) {
        initFirebase();
    }

    async function initFirebase() {
        firebase.initializeApp(firebaseConfig);
        initialized = true;
        await (firebase as any).auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    }
</script>

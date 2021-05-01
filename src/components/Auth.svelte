<script lang="ts">
    import firebase from "firebase/app/dist/index.cjs.js";
    import "firebase/auth/dist/index.cjs.js";
    import { browser } from "$app/env";
    import { session } from "$app/stores";

    const { firebaseConfig } = $session;

    if (browser) {
        initFirebase();
    }

    async function initFirebase() {
        firebase.initializeApp(firebaseConfig);
        await (firebase as any).auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    }
</script>

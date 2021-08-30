<script context="module" lang="ts">
    let initialized = false;
    import { writable } from "svelte/store";
    import type { FirebaseApp } from "firebase/app";

    export const firebaseApp = writable<FirebaseApp>(null);
</script>

<script lang="ts">
    import { initializeApp } from "firebase/app";
    import {
        getAuth,
        setPersistence,
        inMemoryPersistence,
    } from "firebase/auth";
    import { browser } from "$app/env";
    import { session } from "$app/stores";

    const { firebaseConfig } = $session;

    if (browser && !initialized && firebaseConfig) {
        initFirebase();
    }

    async function initFirebase() {
        $firebaseApp = initializeApp(firebaseConfig);
        initialized = true;
        const auth = getAuth();
        setPersistence(auth, inMemoryPersistence);
    }
</script>

<script context="module" lang="ts">
    export async function preload(page, session) {
        const { id } = page.params;
        return { id };
    }
</script>

<script lang="ts">
    export let id: string;
</script>

<h1>Plugin id: {id}</h1>

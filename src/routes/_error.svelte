<script lang="ts">
    import Navigation from "../components/navigation/Navigation.svelte";
    export let status: number;
    export let error: Error;

    const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
    <title>{status}</title>
</svelte:head>

<div class="flex-grow bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="container py-4 mx-auto">
        <Navigation/>
    </div>
    <div class="flex items-center flex-col m-16">
        <h1 class="my-2 pb-1 text-4xl border-b-4 border-blue-500">Error {status}</h1>
        <h2 class="py-2 text-2xl">{error.message}</h2>

        {#if dev && error.stack}
            <pre class="py-4">{error.stack}</pre>
        {/if}
    </div>
</div>

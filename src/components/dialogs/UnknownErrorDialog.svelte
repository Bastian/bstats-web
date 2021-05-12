<!--
@component
A dialog for unknown errors.
Optionally accepts an error property that gets stringified and displayed
to the user.
-->
<script lang="ts">
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let error: unknown = undefined;
</script>

<Dialog bind:open>
    <span slot="title"> Oops, something went wrong </span>
    <div slot="content">
        Welp, this should not have happened. You found an unknown error and we
        don't know what to do with it.
        {#if error}
            Please try again and report the following error to someone: <!-- TODO Tell to whom -->
            <code
                class="mt-2 p-2 bg-gray-100 dark:bg-gray-900 block w-full max-h-32 overflow-auto select-all break-all "
            >
                {JSON.stringify(error)}
            </code>
        {:else}
            Please try again.
        {/if}
    </div>
</Dialog>

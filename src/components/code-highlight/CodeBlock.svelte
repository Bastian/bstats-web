<script lang="ts">
    import "./highlight.css";
    import CodeHighlightWorker from "./CodeHighlightWorker?worker&inline";
    import dedentFunction from "dedent";
    import { onDestroy } from "svelte";

    let className = "";
    export { className as class };

    export let code: string;
    export let language: string = undefined;

    /**
     * Whether or not auto-dedent should be enabled
     * (i.e., if trailing spaces should be removed).
     */
    export let noDedent = false;

    const worker = new CodeHighlightWorker();
    onDestroy(() => worker.terminate());

    let highlighted: string;
    $: {
        worker.postMessage({
            code: noDedent ? code : dedentFunction(code),
            language,
        });
    }

    worker.addEventListener("message", (message) => {
        highlighted = message.data;
    });
</script>

<div class={className}>
    <pre
        class="text-sm w-full overflow-x bg-white dark:bg-gray-800 ring-2 ring-gray-100 dark:ring-gray-700 rounded p-2">
        <code class="rounded-lg hljs">
            {#if highlighted}
                {@html highlighted}
            {:else}
                {noDedent ? code : dedentFunction(code)}
            {/if}
        </code>
    </pre>
</div>

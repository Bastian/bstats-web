<script lang="ts">
    import Button from "$components/forms/Button.svelte";
    import Exclamation from "$components/hero-icons/Exclamation.svelte";
    import { createEventDispatcher } from "svelte";
    import Modal from "./Modal.svelte";

    export let open = false;

    export let type: "error" | "warn" = "error";

    const dispatch = createEventDispatcher();

    function close() {
        open = false;
        dispatch("close");
    }
</script>

<Modal {open} on:close={close}>
    <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
            <div
                class:bg-red-100={type == "error"}
                class:dark:bg-red-900={type == "error"}
                class:bg-yellow-50={type == "warn"}
                class:dark:bg-yellow-600={type == "warn"}
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
            >
                {#if type == "error"}
                    <Exclamation
                        class="h-6 w-6 text-red-600 dark:text-red-100"
                    />
                {:else if type == "warn"}
                    <Exclamation
                        class="h-6 w-6 text-yellow-500 dark:text-yellow-100"
                    />
                {/if}
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                    class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                >
                    <slot name="title" />
                </h3>
                <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-200">
                        <slot name="content" />
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div
        class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
    >
        <Button on:click={close} class="w-full sm:w-auto">Okay</Button>
    </div>
</Modal>

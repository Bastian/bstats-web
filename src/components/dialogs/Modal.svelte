<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import clickOutside from "../../helpers/clickOutside";
    
    export let open = false;

    let dialogElement: HTMLElement;
    
    const dispatch = createEventDispatcher();
    
    function dialogTransition(node: Element, {
        delay = 0,
        duration = 400
    }) {
        const o = +getComputedStyle(node).opacity;
        
        return {
            delay,
            duration,
            css: (t: number) => {
                const eased = cubicInOut(t);

                return `
                    opacity: ${t * o};
                    transform: scale(${eased * 0.05 + 0.95})
                `;
            }
        };
    }
    
    function close() {
        open = false;
        dispatch("close");
    }

    // A boolean that is true if the modal has been opened recently
    let openedRecently: boolean;
    $: {
        if (open) {
            openedRecently = true;
            setTimeout(() => openedRecently = false, 200);
        } else {
            openedRecently = false;
        }
    }

    function handleClickOutside() {
        // We only close the modal when it was not opened recently.
        // This is mainly to prevent the dialog from closing immediately 
        // because the click-outside is also triggered by the action that
        // caused the modal to open. 
        if (!openedRecently) {
            close();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key == "Escape") {
            close();
        }

        // Trap focus to prevent the user from tabbing out of the modal
        // while it is open
        if (open && event.key === "Tab") {
            const nodes = dialogElement.querySelectorAll("*");
            const tabable = Array
                .from(nodes)
                .filter((node: HTMLElement) => node.tabIndex >= 0);

            let index = tabable.indexOf(document.activeElement);
            if (index === -1 && event.shiftKey) index = 0;

            index += tabable.length + (event.shiftKey ? -1 : 1);
            index %= tabable.length;

            (tabable[index] as HTMLElement).focus();
            event.preventDefault();
        }
    }

    function handleDialogOpen(el: HTMLElement) {
        // Focus the first tabable element in the modal when if opens
        const nodes = el.querySelectorAll("*");
        const tabable = Array
            .from(nodes)
            .filter((node: HTMLElement) => node.tabIndex >= 0);
        if (tabable.length > 0) {
            (tabable[0] as HTMLElement).focus();
        }
        
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if open}
    <div 
        bind:this={dialogElement}
        use:handleDialogOpen
        class="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
        <div class="text-center">
            <div
                transition:fade={{duration: 200}}
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
            />
            
            <div 
                transition:dialogTransition={{duration: 200}}
                use:clickOutside={handleClickOutside}
                class="inline-block rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle sm:max-w-lg sm:w-full"
            >
                <slot></slot>
            </div>
        </div>
    </div>
{/if}

<script lang="ts">
    /*
     * This component can be used to prevent page scrolling.
     * It can either be just mounted and unmounted to control the scrolling
     * behavior, or be controlled with the "active" property.
     */
    import { onDestroy } from "svelte";

    export let active = true;

    function disableScrolling() {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = "fixed";
    }

    function reEnableScrolling() {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    $: if (active) {
        disableScrolling();
    } else {
        reEnableScrolling();
    }

    onDestroy(() => reEnableScrolling());
</script>

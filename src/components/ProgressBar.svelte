<script lang="ts">
    export let progress = 0;

    $: progressPercent = Math.min(100, Math.max(0, Math.ceil(progress * 100)));

    export let backgroundClass = "bg-blue-200";
    export let progressClass = "bg-blue-500";
</script>

<div class="relative pt-1">
    <div
        class="{backgroundClass} transition-all overflow-hidden h-2 text-xs flex rounded"
    >
        <div
            style="width:{progressPercent}%"
            class="{progressClass} transition-all shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
        />
    </div>
</div>

<script lang="ts">
    export let name: string;
    export let color: string;
</script>

<div class="flex items-center p-1 label">
    <div
        style="background-color: {color}"
        class="color px-4 py-1.5 ml-2 mr-1 rounded-full inline-block"
    />
    <span class="truncate">
        {name}
    </span>
</div>

<style>
    .label {
        max-width: 200px;
    }
</style>

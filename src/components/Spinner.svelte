<script lang="ts">
    let className: string | null;
    export { className as class };
</script>

<style>
    div {
        border-top-color: #1E3A8A;
    }
</style>

<div class="animate-spin rounded-full border-8 border-gray-200 border-t-8 {className}"></div>

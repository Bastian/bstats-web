<script lang="ts">
    let className: string = "";
    export { className as class };

    export let center = false;
</script>

<style>
    div {
        border-top-color: #1E3A8A;
    }

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<div class:center>
    <div class="animate-spin rounded-full border-8 border-gray-200 border-t-8 {className}"></div>
</div>

<script>
    import Dialog from "./Dialog.svelte";

    export let open = false;
</script>

<Dialog bind:open>
    <span slot="title"> Cannot create account </span>
    <div slot="content">
        The provided email is already in use!
        <br />
        If you already have a bStats account, please login instead.
    </div>
</Dialog>

<!-- 
@component
Can be passed an error object and then displays it to the user in a dialog.
It has some special handling for commonly encountered errors (e.g., from
firebase) and general-purpose handling for unknown errors.
-->
<script lang="ts">
    import Dialog from "$components/dialogs/Dialog.svelte";
    import MailAlreadyInUseDialog from "$components/dialogs/MailAlreadyInUseDialog.svelte";
    import UnknownErrorDialog from "$components/dialogs/UnknownErrorDialog.svelte";

    export let error: unknown;
    let lastKnownError: unknown;

    let generalPurposeDialogOpen = false;
    let generalPurposeDialogTitle = "";
    let generalPurposeDialogContent = "";

    let mailAlreadyInUseDialogOpen = false;
    let unknownErrorDialogOpen = false;

    $: {
        lastKnownError = error;
        if (error && error["code"]) {
            switch (error["code"]) {
                case "auth/email-already-in-use":
                    mailAlreadyInUseDialogOpen = true;
                    break;
                case "auth/account-exists-with-different-credential":
                    generalPurposeDialogTitle = 
                        "E-Mail already linked with other auth provider";
                    generalPurposeDialogContent = 
                        "Your E-Mail address is already in use with another authentication " +
                        "method.If you want to link your existing account with another " +
                        "third-party provider, please login first with your existing provider " +
                        "and then link your account in your profile settings";
                    generalPurposeDialogOpen = true;
                    break;
                case "auth/cancelled-popup-request":
                case "auth/popup-closed-by-user":
                    // Can be ignored
                    break;
                default:
                    unknownErrorDialogOpen = true;
                    console.error(error);
                    break;
            }
        } else if (error) {
            unknownErrorDialogOpen = true;
            console.error(error);
        }
        error = null;
    }
</script>

<Dialog bind:open={generalPurposeDialogOpen}>
    <span slot="title">{generalPurposeDialogTitle}</span>
    <div slot="content">{generalPurposeDialogContent}</div>
</Dialog>

<MailAlreadyInUseDialog bind:open={mailAlreadyInUseDialogOpen} />
<UnknownErrorDialog bind:open={unknownErrorDialogOpen} error={lastKnownError} />

<script lang="ts">
    import { Dialog } from 'bits-ui';
    import { invalidate } from '$app/navigation';
    import { resolve } from '$app/paths';
    import Button from './button.svelte';

    let isSubmitting = $state(false);
    let errorMessage = $state<string | null>(null);
    let acceptButtonRef = $state<HTMLButtonElement | null>(null);

    async function acceptTos() {
        isSubmitting = true;
        errorMessage = null;

        try {
            const response = await fetch('/api/accept-tos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to accept terms of use');
            }

            // Refresh session data to get updated tosAccepted value
            await invalidate('app:session');
        } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            isSubmitting = false;
        }
    }
</script>

<Dialog.Root open={true}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
            class="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            escapeKeydownBehavior="ignore"
            interactOutsideBehavior="ignore"
            onOpenAutoFocus={(e) => {
                e.preventDefault();
                acceptButtonRef?.focus();
            }}
        >
            <Dialog.Title class="text-xl font-semibold text-slate-900">
                Terms of use updated
            </Dialog.Title>
            <Dialog.Description class="mt-5 text-sm text-slate-600">
                We have updated our terms of use. Please review and accept them to continue using
                bStats.
            </Dialog.Description>

            <div class="mt-3">
                <a
                    href={resolve('/terms-of-use')}
                    class="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                >
                    Read the terms of use
                </a>
            </div>

            {#if errorMessage}
                <div class="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            {/if}

            <div class="mt-6">
                <Button
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting}
                    onclick={acceptTos}
                    bind:ref={acceptButtonRef}
                >
                    {#if isSubmitting}
                        Accepting...
                    {:else}
                        I accept the terms of use
                    {/if}
                </Button>
            </div>

            <p class="mt-4 text-xs text-slate-500">
                If you do not wish to accept the updated terms, please contact us to delete your
                account.
            </p>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

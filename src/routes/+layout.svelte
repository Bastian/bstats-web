<script lang="ts">
    import '../app.css';
    import Header from '$lib/components/layout/header.svelte';
    import Footer from '$lib/components/layout/footer.svelte';
    import TosAcceptanceModal from '$lib/components/tos-acceptance-modal.svelte';
    import { page } from '$app/state';

    let { data, children } = $props();

    // Pages that should be accessible even without accepting TOS
    const legalPages = ['/terms-of-use', '/privacy-policy', '/imprint'];

    // Show TOS modal when:
    // - User is logged in
    // - TOS required version is set
    // - User hasn't accepted the required version yet
    // - User is NOT on a legal page (allow them to read those)
    const shouldShowTosModal = $derived(
        data.user &&
            data.tosRequiredVersion &&
            (!data.user.tosAccepted || data.user.tosAccepted < data.tosRequiredVersion) &&
            !legalPages.includes(page.url.pathname)
    );
</script>

<svelte:head>
    <title>bStats</title>
    <link rel="icon" href="/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<!-- TODO Enable
{#if data.user && !data.user?.emailVerified}
	<div
		class="border-b border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800"
	>
		Your email address is not verified. Please check your inbox for a verification email. If you did
		not receive the email, please&nbsp;
		<a href="#todo" class="font-medium underline transition-colors hover:text-yellow-900">
			click here to resend it
		</a>.
	</div>
{/if}
-->

<Header user={data.user} allSoftware={data.allSoftware} myPlugins={data.myPlugins} />

<main>
    {@render children?.()}
</main>

<Footer loggedIn={!!data.session} />

{#if shouldShowTosModal}
    <TosAcceptanceModal />
{/if}

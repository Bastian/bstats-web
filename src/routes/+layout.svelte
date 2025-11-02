<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GlobalScripts from '$lib/components/GlobalScripts.svelte';

	let { data, children } = $props();
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

<Navigation user={data.user} allSoftware={data.allSoftware} myPlugins={data.myPlugins} />

<main>
	{@render children?.()}
</main>

<Footer loggedIn={!!data.session} />

<GlobalScripts />

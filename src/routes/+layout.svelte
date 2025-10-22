<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GlobalScripts from '$lib/components/GlobalScripts.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>bStats</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
	<link rel="icon" href="/favicon.ico" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Navigation
	loggedIn={data.loggedIn}
	user={data.user}
	allSoftware={data.allSoftware}
	myPlugins={data.myPlugins}
/>

<main>
	{@render children?.()}
</main>

<Footer loggedIn={data.loggedIn} />

<GlobalScripts />

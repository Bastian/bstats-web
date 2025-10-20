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

	<!-- CSS -->
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<link href="/stylesheets/materialize.min.css" type="text/css" rel="stylesheet" media="screen,projection" />
	<link href="/stylesheets/style.css" type="text/css" rel="stylesheet" media="screen,projection" />

	<!-- Scripts -->
	{@html '<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>'}
	{@html '<script src="/javascripts/materialize/materialize.min.js"></script>'}
	{@html '<script src="/javascripts/materialize/init.js"></script>'}
</svelte:head>

<Navigation
	customColor1={data.customColor1}
	loggedIn={data.loggedIn}
	user={data.user}
	allSoftware={data.allSoftware}
	myPlugins={data.myPlugins}
/>

<main>
	{@render children?.()}
</main>

<Footer customColor1={data.customColor1} loggedIn={data.loggedIn} />

<GlobalScripts />


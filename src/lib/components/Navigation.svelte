<script lang="ts">
	import { onMount } from 'svelte';

	type Software = {
		id: number;
		name: string;
		url: string;
		globalPlugin: boolean;
	};

	type Plugin = {
		id: number;
		name: string;
		software: {
			id: number;
			name: string;
			url: string;
		};
	};

	type User = {
		username: string;
		admin: boolean;
	};

	let {
		customColor1 = 'teal',
		loggedIn = false,
		user = null,
		allSoftware = [],
		myPlugins = []
	} = $props<{
		customColor1?: string;
		loggedIn?: boolean;
		user?: User | null;
		allSoftware?: Software[];
		myPlugins?: Plugin[];
	}>();

	onMount(() => {
		// Initialize Materialize dropdowns and side nav when component mounts
		// @ts-ignore - jQuery/Materialize global from CDN
		if (typeof window !== 'undefined' && window.$) {
			// @ts-ignore
			window.$('.button-collapse').sideNav();
			// @ts-ignore
			window.$('.dropdown-button').dropdown({
				constrainWidth: false,
				belowOrigin: true,
				hover: true
			});
		}
	});
</script>

<!-- Side navigation -->
<ul id="slide-out" class="side-nav">
	<li>
		<div class="userView" style="min-height: 176px">
			<img class="background" src="/images/cover.jpg" alt="Background" />
			<img class="circle" src="/images/steve.jpg" alt="Avatar" />
			{#if loggedIn && user}
				<span class="white-text name">{user.username}</span>
				<span class="white-text email"> </span>
			{:else}
				<span class="white-text name">Steve</span>
				<span class="white-text email">steve@minecraft.net</span>
			{/if}
		</div>
	</li>
	<!-- Mobile navigation (hide on desktop) -->
	{#if loggedIn}
		<div class="hide-on-med-and-down">
			<li>
				<a class="subheader"
					><i class="material-icons left" style="font-size: 30px">near_me</i>Navigation</a
				>
			</li>
			<li><a href="/plugin/1337/random">Random plugin</a></li>
			<li><a href="/plugin-list">Plugin list</a></li>
			<li>
				<div class="divider"></div>
			</li>
		</div>
	{/if}
	<div class="hide-on-large-only">
		<li>
			<a class="subheader"><i class="material-icons left" style="font-size: 30px">near_me</i>Navigation</a
			>
		</li>
		<li><a href="/plugin/1337/random">Random plugin</a></li>
		<li><a href="/plugin-list">Plugin list</a></li>
		<li>
			<div class="divider"></div>
		</li>
		<li>
			<a class="subheader"><i class="material-icons left" style="font-size: 30px">language</i>Global stats</a
			>
		</li>
		{#each allSoftware as software}
			{#if software.globalPlugin}
				<li><a href="/global/{software.url}">{software.name}</a></li>
			{/if}
		{/each}
		<li>
			<div class="divider"></div>
		</li>
	</div>
	<li>
		<a class="subheader"><i class="material-icons left" style="font-size: 30px">person</i>Account</a>
	</li>
	{#if loggedIn}
		<li><a class="waves-effect" href="/change-password">Change password</a></li>
		<li><a class="waves-effect" href="/logout">Logout</a></li>
		<li><a class="waves-effect" href="/add-plugin">Add plugin</a></li>
	{:else}
		<li><a class="waves-effect" href="/login">Login</a></li>
		<li><a class="waves-effect" href="/register">Create new account</a></li>
	{/if}
	{#if loggedIn && myPlugins.length > 0}
		<div class="hide-on-large-only">
			<li>
				<div class="divider"></div>
			</li>
			<li>
				<a class="subheader"
					><i class="material-icons left" style="font-size: 30px">content_paste</i>My Plugins</a
				>
			</li>
			{#each myPlugins as plugin}
				<li>
					<a class="waves-effect truncate" href="/plugin/{plugin.software.url}/{plugin.name}"
						>{plugin.name} ({plugin.software.name})</a
					>
				</li>
			{/each}
		</div>
	{/if}
	<li>
		<div class="divider"></div>
	</li>
	<li>
		<a class="subheader"><i class="material-icons left" style="font-size: 30px">star</i>Credits</a>
	</li>
	<li><a class="waves-effect" href="https://www.gamehosting.it/">GameHosting</a></li>
	<li><a class="waves-effect" href="/credits">Credits page</a></li>
</ul>

<!-- My plugins dropdown -->
<ul id="dropdownMyPlugins" class="dropdown-content">
	{#if loggedIn}
		{#each myPlugins as plugin}
			<li>
				<a href="/plugin/{plugin.software.url}/{plugin.name}" class="truncate {customColor1}-text"
					>{plugin.name} ({plugin.software.name})</a
				>
			</li>
		{/each}
	{/if}
</ul>

<!-- Global stats dropdown -->
<ul id="dropdownGlobalStats" class="dropdown-content">
	{#each allSoftware as software}
		{#if software.globalPlugin}
			<li>
				<a href="/global/{software.url}" class="truncate {customColor1}-text">{software.name}</a>
			</li>
		{/if}
	{/each}
</ul>

<!-- Account -->
<ul id="dropdownAccount" class="dropdown-content">
	{#if loggedIn && user}
		<li>
			<a href="/author/{user.username}" class="truncate {customColor1}-text">My page</a>
		</li>
		<li><a href="/change-password" class="truncate {customColor1}-text">Change password</a></li>
		<li><a href="/logout" class="truncate {customColor1}-text">Logout</a></li>
	{:else}
		<li><a href="/register" class="truncate {customColor1}-text">Register</a></li>
		<li><a href="/login" class="truncate {customColor1}-text">Login</a></li>
	{/if}
</ul>

<nav class="{customColor1} darken-3" role="navigation">
	<div class="nav-wrapper container">
		<a
			id="logo-container"
			href="/"
			class="brand-logo left hide-on-med-and-down tooltipped"
			data-position="right"
			data-delay="5000"
			data-tooltip="You found a secret tooltip!">bStats</a
		>
		<a id="logo-container" href="/" class="brand-logo hide-on-large-only">bStats</a>
		<!-- "Normal" Navigation (only show on desktop) -->
		<ul class="right hide-on-med-and-down">
			{#if loggedIn && myPlugins.length > 0}
				<li>
					<a href="/add-plugin">
						<i class="material-icons left" style="font-size: 30px">add</i>Add plugin
					</a>
				</li>
				<li>
					<a
						class="dropdown-button"
						href="#!"
						data-beloworigin="true"
						data-constrainwidth="false"
						data-hover="true"
						data-activates="dropdownMyPlugins"
					>
						<i class="material-icons left" style="margin-right: 0px; font-size: 30px">arrow_drop_down</i
						>My Plugins
					</a>
				</li>
			{:else if loggedIn}
				<li>
					<a href="/add-plugin">
						<i class="material-icons left" style="font-size: 30px">add</i>Add plugin
					</a>
				</li>
			{:else}
				<li>
					<a href="/plugin/1337/random">
						<i class="material-icons left" style="font-size: 30px">shuffle</i>Random plugin
					</a>
				</li>
			{/if}
			<li>
				<a href="/plugin-list">
					<i class="material-icons left" style="font-size: 30px">list</i>Plugin list
				</a>
			</li>
			<li>
				<a
					class="dropdown-button"
					href="#!"
					data-beloworigin="true"
					data-hover="true"
					data-activates="dropdownGlobalStats"
				>
					<i class="material-icons left" style="font-size: 30px">language</i>Global stats
				</a>
			</li>
			<li>
				<a
					class="dropdown-button"
					href="#!"
					data-beloworigin="true"
					data-constrainwidth="false"
					data-hover="true"
					data-activates="dropdownAccount"
				>
					<i class="material-icons left" style="font-size: 30px">account_circle</i>Account
				</a>
			</li>
		</ul>

		<a href="#" data-activates="slide-out" class="button-collapse"
			><i class="material-icons">menu</i></a
		>
	</div>
</nav>

<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>bStats - Credits</title>
	<meta name="description" content="The credits page." />
</svelte:head>

<div class="container">
	<div class="section no-pad-bot" id="index-banner">
		<br /><br />
		<h1 class="header center {data.customColor1}-text">Credits</h1>
		<ul class="collection with-header">
			<li class="collection-header"><h4>Sponsored by GameHosting</h4></li>
			<li class="collection-item">
				<div>
					bStats is sponsored by <b><a href="https://www.gamehosting.it/">GameHosting</a></b>!
					<a href="https://www.gamehosting.it/" class="secondary-content"
						><i class="material-icons">web</i></a
					>
				</div>
			</li>
		</ul>
		<ul class="collection with-header">
			<li class="collection-header"><h4>Author</h4></li>
			<li class="collection-item">
				<div>
					<b>BtoBastian</b>
					<a href="http://bastian-oppermann.de" class="secondary-content"
						><i class="material-icons">web</i></a
					>
				</div>
			</li>
		</ul>
		<ul class="collection with-header">
			<li class="collection-header"><h4>Testers</h4></li>
			<li class="collection-item">
				<div>
					<b>f_</b> who also suggested the name for bStats and forced me to create a credits page
				</div>
			</li>
		</ul>
		<ul class="collection with-header">
			<li class="collection-header"><h4>Special thanks</h4></li>
			<li class="collection-item">
				<div>
					<b>Cloudflare</b>
					<a href="https://www.cloudflare.com/" class="secondary-content"
						><i class="material-icons">web</i></a
					>
				</div>
			</li>
			<li class="collection-item">
				<div>
					<b>Highcharts</b>
					<a href="http://www.highcharts.com/" class="secondary-content"
						><i class="material-icons">web</i></a
					>
				</div>
			</li>
		</ul>
		<br /><br /><br />
	</div>
</div>

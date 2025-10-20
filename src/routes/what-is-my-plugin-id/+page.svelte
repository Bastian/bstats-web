<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>bStats - What is my plugin id?</title>
	<meta name="description" content="A list with the plugin ids of all your plugins." />
</svelte:head>

<main>
	<div class="container">
		<br /><br />
		{#if !data.loggedIn}
			<h5 class="{data.customColor1}-text col s12 center-align">Please login first!</h5>
			<img
				src="/images/i-need-you-to-login.jpg"
				alt="I need you to login!"
				style="max-width: 90%; min-width: 50%; margin: 0 auto; display: block;"
			/>
		{:else if data.myPlugins.length <= 0}
			<h3 class="{data.customColor1}-text col s12 center-align">You don't have any plugins!</h3>
			<div class="row center">
				<h5 class="header col s12 light authorbox">Here's a random cat image instead:</h5>
			</div>
			<img
				src="https://cataas.com/cat?{Math.random()}"
				alt="Moew!"
				style="max-width: 90%; min-width: 50%; margin: 0 auto; display: block;"
			/>
		{:else}
			<h5 class="{data.customColor1}-text col s12 center-align">Your plugin ids:</h5>

			<div class="card material-table">
				<div style="overflow-x:auto;">
					<div style="min-width: 650px">
						<table id="plugin-ids-list">
							<thead>
								<tr>
									<th>Plugin</th>
									<th>Software</th>
									<th>Plugin Id</th>
								</tr>
							</thead>
							<tbody>
								{#each data.myPlugins as plugin}
									<tr>
										<td>{plugin.name}</td>
										<td>{plugin.software.name}</td>
										<td><b>{plugin.id}</b></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
		<br /><br />
	</div>
</main>

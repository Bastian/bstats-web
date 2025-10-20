<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Initialize Materialize collapsible
		if (typeof window !== 'undefined' && window.$) {
			(window.$ as any)('.collapsible').collapsible();
		}

		// Load code prettify
		const script = document.createElement('script');
		script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
		document.body.appendChild(script);
	});
</script>

<svelte:head>
	<title>bStats - Include metrics</title>
	<meta
		name="description"
		content="A description on how to include bStats to your plugin"
	/>
	<style>
		.withBox {
			outline: 1px solid #ccc;
			padding: 5px;
			margin: 5px;
		}
	</style>
</svelte:head>

<main>
	<div class="container">
		<br />
		{#if data.addedPlugin}
			<div class="col s12">
				<div class="card">
					<div class="card-content">
						<b>You've successfully added your plugin!</b><br />
						If you haven't done it already, you have to add bStats to your plugin.<br />
					</div>
				</div>
			</div>
			<div class="col s12">
				<div class="card">
					<div class="card-content">
						<b>Useful Information</b><br />
						Your plugin <b>{data.pluginName}</b> has the plugin id <b>{data.pluginId}</b>. You
						will need it when adding bStats to your plugin.
						<br />
						You can view the ids of all your plugins by visiting the <a
							href="/what-is-my-plugin-id">What is my plugin id?</a
						> page.
					</div>
				</div>
			</div>
		{/if}
		<div class="col s12">
			<div class="card">
				<div class="card-content">
					<p>Including bStats is very easy. There are basically two ways to include bStats:</p>
					<ul class="collapsible" data-collapsible="accordion">
						<li>
							<div class="collapsible-header">
								<i class="material-icons">code</i>Using Maven to shade bStats
							</div>
							<div class="collapsible-body">
								<div style="margin-left: 10px; margin-top: 4px; margin-right: 10px;">
									<b class="red-text"
										>Note: You are expected to have a basic understanding on how to use Maven!</b
									><br />
									<b>1. Include the dependency.</b><br />
									There are 4 possible artifact ids: <i><b>bstats-bukkit</b></i>, <i
										><b>bstats-bungeecord</b></i
									>, <i><b>bstats-sponge</b></i>, and <i><b>bstats-velocity</b></i>.
									<pre class="prettyprint withBox" style="border: none"><code class="language-xml"
											>&lt;dependency&gt;
  &lt;groupId&gt;org.bstats&lt;/groupId&gt;
  &lt;artifactId&gt;bstats-bukkit&lt;/artifactId&gt;
  &lt;version&gt;3.0.2&lt;/version&gt;
  &lt;scope&gt;compile&lt;/scope&gt;
&lt;/dependency&gt;</code
										></pre>
									<b>3. Shade bStats into your plugin.</b><br />
									This step is very important. Shading means, that the necessary classes are copied
									into your plugin when you compile it. It also relocates the class to an other
									package. Make sure to change <i>your.package</i> to your own package! If you are
									using Sponge, do <b>not</b> relocate the bStats class (just remove the
									&lt;configuration&gt;...&lt;/configuration&gt; part).
									<pre class="prettyprint withBox" style="border: none"><code class="language-xml"
											>&lt;build&gt;
  &lt;plugins&gt;
    &lt;plugin&gt;
      &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
      &lt;artifactId&gt;maven-shade-plugin&lt;/artifactId&gt;
      &lt;version&gt;3.1.0&lt;/version&gt;
      &lt;configuration&gt;
        &lt;relocations&gt;
          &lt;relocation&gt;
            &lt;pattern&gt;org.bstats&lt;/pattern&gt;
            &lt;!-- Replace this with your package! --&gt;
            &lt;shadedPattern&gt;your.package&lt;/shadedPattern&gt;
          &lt;/relocation&gt;
        &lt;/relocations&gt;
      &lt;/configuration&gt;
      &lt;executions&gt;
        &lt;execution&gt;
          &lt;phase&gt;package&lt;/phase&gt;
          &lt;goals&gt;
            &lt;goal&gt;shade&lt;/goal&gt;
          &lt;/goals&gt;
        &lt;/execution&gt;
      &lt;/executions&gt;
    &lt;/plugin&gt;
  &lt;/plugins&gt;
&lt;/build&gt;</code
										></pre>
									<b>4. You're done!</b><br />
									Your final pom.xml now may look like this:
									<pre class="prettyprint withBox" style="border: none"><code class="language-xml"
											>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;
     xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;
     xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;
  &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;

  &lt;groupId&gt;me.name&lt;/groupId&gt;
  &lt;artifactId&gt;pluginname&lt;/artifactId&gt;
  &lt;version&gt;1.0.0&lt;/version&gt;

  &lt;repositories&gt;
    &lt;repository&gt;
      &lt;id&gt;spigot-repo&lt;/id&gt;
      &lt;url&gt;https://hub.spigotmc.org/nexus/content/groups/public/&lt;/url&gt;
    &lt;/repository&gt;
  &lt;/repositories&gt;

  &lt;dependencies&gt;
    &lt;!-- Spigot as an example --&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.spigotmc&lt;/groupId&gt;
      &lt;artifactId&gt;spigot-api&lt;/artifactId&gt;
      &lt;version&gt;LATEST&lt;/version&gt;
      &lt;scope&gt;provided&lt;/scope&gt;
    &lt;/dependency&gt;
    &lt;!-- bStats --&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.bstats&lt;/groupId&gt;
      &lt;artifactId&gt;bstats-bukkit&lt;/artifactId&gt;
      &lt;version&gt;3.0.2&lt;/version&gt;
      &lt;scope&gt;compile&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;

  &lt;build&gt;
    &lt;plugins&gt;
      &lt;plugin&gt;
        &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
        &lt;artifactId&gt;maven-shade-plugin&lt;/artifactId&gt;
        &lt;version&gt;3.1.0&lt;/version&gt;
        &lt;configuration&gt;
          &lt;relocations&gt;
            &lt;relocation&gt;
              &lt;pattern&gt;org.bstats&lt;/pattern&gt;
              &lt;shadedPattern&gt;me.name.util&lt;/shadedPattern&gt;
            &lt;/relocation&gt;
          &lt;/relocations&gt;
        &lt;/configuration&gt;
        &lt;executions&gt;
          &lt;execution&gt;
            &lt;phase&gt;package&lt;/phase&gt;
            &lt;goals&gt;
              &lt;goal&gt;shade&lt;/goal&gt;
            &lt;/goals&gt;
          &lt;/execution&gt;
        &lt;/executions&gt;
      &lt;/plugin&gt;
    &lt;/plugins&gt;
  &lt;/build&gt;

&lt;/project&gt;</code
										></pre>
								</div>
							</div>
						</li>
						<li>
							<div class="collapsible-header">
								<i class="material-icons">code</i>Manually copy the Metrics class
							</div>
							<div class="collapsible-body">
								<div style="margin-left: 10px; margin-top: 4px; margin-right: 10px;">
									If you don't want to use Maven that's no problem. You can just copy and paste the
									required class into your project. All classes can be found in the <a
										href="https://github.com/Bastian/bStats-Metrics/tree/single-file"
										>GitHub repository</a
									>.<br />
									Just copy the class fitting your server software. Make sure to change the package
									from <i>org.bstats</i> to your own package.<br />
									<div style="overflow-x:auto;">
										<div style="min-width: 300px">
											<table>
												<thead>
													<tr>
														<th data-field="id">Software</th>
														<th data-field="name">Standard</th>
													</tr>
												</thead>

												<tbody>
													{#each data.software as sw}
														{#if sw.metricsClass !== null}
															<tr>
																<td><b>{sw.name}</b></td>
																<td><a href={sw.metricsClass} target="_blank">Metrics.java</a></td>
															</tr>
														{/if}
													{/each}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
					After adding the Metrics class to your plugin, you now have to create an instance of the
					class. How this is done depends on the server software you are using.<br />
					Just take a look at the examples for your server software:
					<table>
						<thead>
							<tr>
								<th data-field="id">Software</th>
								<th data-field="name">Example</th>
							</tr>
						</thead>

						<tbody>
							{#each data.software as sw}
								{#if sw.examplePlugin !== null}
									<tr>
										<td><b>{sw.name}</b></td>
										<td><a href={sw.examplePlugin} target="_blank">ExamplePlugin.java</a></td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
					You may notice, that all examples also include a very basic example on how to use custom
					charts. You can find a detailed tutorial on how to use them <a href="/help/custom-charts"
						>here</a
					>. If you don't need custom charts you can (but not have to) use the lite version of the
					Metrics class, too.
				</div>
			</div>
		</div>
	</div>
</main>
<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>bStats - Include metrics</title>
	<meta name="description" content="A description on how to include bStats to your plugin" />
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Documentation</Badge>{/snippet}
		{#snippet title()}Include metrics{/snippet}
		{#snippet content()}
			Choose your favorite workflow: take the Maven route for a maintained dependency, or drop-in
			the Metrics class. Both paths end with live data in your dashboard.
		{/snippet}
		{#snippet extra()}
			<Button href={resolve('/getting-started')}>Back to getting started</Button>
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12 space-y-12">
		{#if data.addedPlugin}
			<div class="space-y-4">
				<div class="doc-callout doc-callout-info">
					<p class="text-sm font-semibold">Plugin added successfully</p>
					<p class="mt-2">
						<span class="font-semibold text-slate-800">{data.pluginName}</span> is registered as
						plugin ID
						<span class="font-semibold text-slate-800">{data.pluginId}</span>. Keep this
						handy—you'll need it inside your metrics initialization.
					</p>
				</div>
				<div class="doc-callout doc-callout-note">
					<p class="text-sm">
						Need a refresher later? You can always revisit the
						<a
							class="font-semibold text-brand-600 hover:text-brand-700"
							href={resolve('/what-is-my-plugin-id')}>What is my plugin ID?</a
						>
						page for every ID tied to your account.
					</p>
				</div>
			</div>
		{/if}

		<div class="grid gap-8 lg:grid-cols-[260px_1fr]">
			<aside class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<h2 class="text-xs tracking-[0.3em] text-slate-400 uppercase">On this page</h2>
				<nav class="mt-4 space-y-2 text-sm text-slate-600">
					<a
						class="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
						href="#maven">Shade via Maven</a
					>
					<a
						class="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
						href="#manual">Manual copy</a
					>
					<a
						class="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
						href="#integration">Wire it up</a
					>
				</nav>
			</aside>

			<div class="space-y-10">
				<article id="maven" class="doc-card space-y-6">
					<div class="space-y-3">
						<span class="text-xs tracking-[0.3em] text-slate-400 uppercase">Option 1</span>
						<h2 class="doc-card-title">Shade bStats using Maven</h2>
						<p class="text-sm leading-relaxed text-slate-600">
							This is the most future-proof way to include bStats. Maven keeps the dependency
							updated, and shading ensures your plugin ships a self-contained Metrics class.
						</p>
					</div>

					<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
						<summary
							class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
						>
							<span>Step 1 · Add the dependency</span>
							<span class="text-xs tracking-[0.2em] text-slate-400 uppercase">Click to toggle</span>
						</summary>
						<div class="mt-4 space-y-4 text-sm text-slate-600">
							<p>
								Choose the artifact that matches your server platform. Recent versions are published
								to Maven Central.
							</p>
							<pre class="doc-code language-xml">{`<dependency>
  <groupId>org.bstats</groupId>
  <artifactId>bstats-bukkit</artifactId>
  <version>3.0.2</version>
  <scope>compile</scope>
</dependency>`}</pre>
							<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Artifacts available</p>
							<ul class="list-disc space-y-1 pl-6 text-sm">
								<li><code class="font-mono text-slate-700">bstats-bukkit</code></li>
								<li><code class="font-mono text-slate-700">bstats-bungeecord</code></li>
								<li><code class="font-mono text-slate-700">bstats-sponge</code></li>
								<li><code class="font-mono text-slate-700">bstats-velocity</code></li>
							</ul>
						</div>
					</details>

					<details class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
						<summary
							class="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700"
						>
							<span>Step 2 · Shade the dependency</span>
							<span class="text-xs tracking-[0.2em] text-slate-400 uppercase">Click to toggle</span>
						</summary>
						<div class="mt-4 space-y-4 text-sm text-slate-600">
							<div class="doc-callout doc-callout-note">
								<p class="text-sm font-semibold text-amber-700">Don't skip this!</p>
								<p class="mt-1 text-sm text-amber-700">
									Shading bundles the Metrics class into your jar. If you use Sponge, skip the
									relocation section.
								</p>
							</div>
							<pre class="doc-code language-xml">{`<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-shade-plugin</artifactId>
      <version>3.1.0</version>
      <configuration>
        <relocations>
          <relocation>
            <pattern>org.bstats</pattern>
            <shadedPattern>your.package</shadedPattern>
          </relocation>
        </relocations>
      </configuration>
      <executions>
        <execution>
          <phase>package</phase>
          <goals>
            <goal>shade</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>`}</pre>
						</div>
					</details>

					<div class="space-y-4 text-sm text-slate-600">
						<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">
							Sample <code class="font-mono text-slate-600">pom.xml</code>
						</p>
						<pre class="doc-code language-xml">{`<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>me.name</groupId>
  <artifactId>pluginname</artifactId>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
      <groupId>org.bstats</groupId>
      <artifactId>bstats-bukkit</artifactId>
      <version>3.0.2</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.1.0</version>
      </plugin>
    </plugins>
  </build>
</project>`}</pre>
					</div>
				</article>

				<article id="manual" class="doc-card space-y-6">
					<div class="space-y-3">
						<span class="text-xs tracking-[0.3em] text-slate-400 uppercase">Option 2</span>
						<h2 class="doc-card-title">Manually bundle the Metrics class</h2>
						<p class="text-sm leading-relaxed text-slate-600">
							Prefer to copy files by hand? Download the Metrics class that matches your platform
							and drop it into your project. Remember to change the package name to something inside
							your namespace.
						</p>
					</div>

					<div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
						<table class="min-w-full divide-y divide-slate-200 text-sm">
							<thead class="bg-slate-100 text-slate-500">
								<tr>
									<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase"
										>Software</th
									>
									<th class="px-4 py-3 text-left font-semibold tracking-[0.18em] uppercase"
										>Download</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-200 bg-white text-slate-600">
								{#each data.software as sw}
									{#if sw.metricsClass !== null}
										<tr>
											<td class="px-4 py-3 font-semibold text-slate-800">{sw.name}</td>
											<td class="px-4 py-3">
												<a
													class="font-semibold text-brand-600 hover:text-brand-700"
													href={sw.metricsClass}
													target="_blank"
													rel="noopener"
												>
													Metrics.java
												</a>
											</td>
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
					<p class="text-sm leading-relaxed text-slate-600">
						Each class is hosted on GitHub. Use the raw file, replace the <code
							class="font-mono text-slate-700">org.bstats</code
						> package name, and keep the file in sync with future releases.
					</p>
				</article>

				<article id="integration" class="doc-card space-y-6">
					<div class="space-y-3">
						<span class="text-xs tracking-[0.3em] text-slate-400 uppercase">Finish up</span>
						<h2 class="doc-card-title">Create the Metrics instance</h2>
						<p class="text-sm leading-relaxed text-slate-600">
							With the class in place, you just need to instantiate Metrics in your plugin. Each
							platform has a slightly different entry point—use the example that matches your
							software.
						</p>
					</div>

					<div class="space-y-6">
						<div>
							<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
								Bukkit / Spigot
							</h3>
							<pre class="doc-code language-java">{`public class ExamplePlugin extends JavaPlugin {
    @Override
    public void onEnable() {
        int pluginId = ${data.pluginId || '12345'}; // Replace with your actual plugin id
        Metrics metrics = new Metrics(this, pluginId);
        metrics.addCustomChart(new Metrics.SimplePie("chart_id", () -> getConfig().getString("some-setting")));
    }
}`}</pre>
						</div>
						<div>
							<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
								BungeeCord
							</h3>
							<pre
								class="doc-code language-java">{`public final class ExampleBungee extends Plugin {
    @Override
    public void onEnable() {
        int pluginId = ${data.pluginId || '12345'};
        Metrics metrics = new Metrics(this, pluginId);
        metrics.addCustomChart(new Metrics.SimpleBarChart("proxy_modes", () -> {
            Map<String, Integer> map = new HashMap<>();
            map.put(getProxy().getConfig().isOnlineMode() ? "Online" : "Offline", 1);
            return map;
        }));
    }
}`}</pre>
						</div>
						<div>
							<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
								Sponge
							</h3>
							<pre
								class="doc-code language-java">{`@Plugin(id = "example", name = "Example", version = "1.0")
public class ExampleSponge {
    @Inject private PluginContainer container;

    @Listener
    public void onServerStart(GameStartedServerEvent event) {
        int pluginId = ${data.pluginId || '12345'};
        Metrics metrics = new Metrics(container, pluginId);
        metrics.addCustomChart(new Metrics.AdvancedPie("worlds", () -> {
            Map<String, Integer> data = new HashMap<>();
            Sponge.server().worldManager().worlds().forEach(world -> data.put(world.key().asString(), 1));
            return data;
        }));
    }
}`}</pre>
						</div>
						<div>
							<h3 class="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
								Velocity
							</h3>
							<pre
								class="doc-code language-java">{`@Plugin(id = "example", name = "Example", version = "1.0")
public class ExampleVelocity {
    @Inject
    public ExampleVelocity(ProxyServer server, Metrics.Factory metricsFactory) {
        int pluginId = ${data.pluginId || '12345'};
        Metrics metrics = metricsFactory.make(this, pluginId);
        metrics.addCustomChart(new Metrics.SimplePie("proxy_version", () -> server.getVersion().getName()));
    }
}`}</pre>
						</div>
					</div>

					<div class="doc-callout doc-callout-info">
						<p class="text-sm font-semibold">Ready to see data flow?</p>
						<p class="mt-2">
							Deploy your plugin, wait for the next stats cycle (about 30 minutes), and you'll spot
							the numbers on your plugin page.
						</p>
					</div>
				</article>
			</div>
		</div>
	</section>
</main>

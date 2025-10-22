<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { resolve } from '$app/paths';

	let { loggedIn = false } = $props<{
		loggedIn?: boolean;
	}>();
</script>

<footer class="border-t border-slate-200 bg-white/90 backdrop-blur">
	<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
		<div class="grid gap-12 md:grid-cols-4">
			<div class="md:col-span-2">
				<div class="inline-flex items-center gap-3">
					<span
						class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-display text-lg font-semibold text-white shadow-md"
					>
						bS
					</span>
					<div>
						<p class="font-display text-xl font-semibold text-slate-900">bStats</p>
						<p class="text-sm text-slate-500">Open source metrics built for plugin tinkerers.</p>
					</div>
				</div>
				<p class="mt-6 max-w-xl text-sm leading-relaxed text-slate-600">
					bStats started as a fun side project and grew into a community-driven way to understand
					how your plugins live in the wild. No sales pitch, just insight and good vibes.
				</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<a href="https://github.com/Bastian/bStats">
						<Badge class="bg-black text-slate-100 transition hover:brightness-110" type="none">
							<img alt="GitHub" src="/images/github-mark-white.svg" class="h-4 w-4" />
							GitHub
						</Badge>
					</a>
					<a href="https://discord.gg/qTXtXuf">
						<Badge
							type="none"
							class="bg-discord-blurple text-white transition hover:brightness-110"
						>
							<img alt="Discord" src="/images/Discord-Symbol-White.svg" class="h-4 w-4" />
							Discord
						</Badge>
					</a>
				</div>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-slate-400 uppercase">Get started</h3>
				<ul class="mt-4 space-y-2 text-sm text-slate-600">
					<li><a href={resolve('/getting-started')} class="hover:text-brand-700">Onboarding</a></li>
					<li><a href={resolve('/faq')} class="hover:text-brand-700">FAQ</a></li>
					<li>
						<a href={resolve('/getting-started/include-metrics')} class="hover:text-brand-700"
							>Include Metrics</a
						>
					</li>
					<li>
						<a href={resolve('/help/custom-charts')} class="hover:text-brand-700">Custom Charts</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-slate-400 uppercase">Account</h3>
				<ul class="mt-4 space-y-2 text-sm text-slate-600">
					{#if loggedIn}
						<li><a href={resolve('/add-plugin')} class="hover:text-brand-700">Add Plugin</a></li>
						<li>
							<a href={resolve('/change-password')} class="hover:text-brand-700">Change password</a>
						</li>
						<li><a href={resolve('/logout')} class="hover:text-brand-700">Logout</a></li>
					{:else}
						<li><a href={resolve('/login')} class="hover:text-brand-700">Log in</a></li>
						<li><a href={resolve('/register')} class="hover:text-brand-700">Create account</a></li>
					{/if}
					<li>
						<a href={resolve('/plugin/spigot/random')} class="hover:text-brand-700">Random plugin</a
						>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-slate-400 uppercase">Legal & more</h3>
				<ul class="mt-4 space-y-2 text-sm text-slate-600">
					<li><a href={resolve('/terms-of-use')} class="hover:text-brand-700">Terms of Use</a></li>
					<li>
						<a href={resolve('/privacy-policy')} class="hover:text-brand-700">Privacy Policy</a>
					</li>
					<li><a href={resolve('/imprint')} class="hover:text-brand-700">Imprint</a></li>
					<li><a href={resolve('/credits')} class="hover:text-brand-700">Credits</a></li>
				</ul>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>Made with <span class="text-brand-500">love</span> by hobbyists for hobbyists.</p>
			<div class="flex flex-wrap gap-4">
				<a href={resolve('/what-is-my-plugin-id')} class="hover:text-brand-700">
					What is my plugin ID?
				</a>
				<a href={resolve('/help/rest-api')} class="hover:text-brand-700">REST API</a>
			</div>
		</div>
	</div>
</footer>

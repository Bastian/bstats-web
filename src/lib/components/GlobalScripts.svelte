<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Mobile navigation toggle
		const toggle = document.querySelector('[data-mobile-nav-toggle]');
		const panel = document.querySelector('[data-mobile-nav-panel]');

		if (toggle && panel) {
			const closePanel = () => {
				panel.classList.add('hidden');
				toggle.setAttribute('aria-expanded', 'false');
			};

			toggle.addEventListener('click', () => {
				const isHidden = panel.classList.contains('hidden');
				panel.classList.toggle('hidden');
				toggle.setAttribute('aria-expanded', String(isHidden));
			});

			panel.querySelectorAll('a').forEach((link) => {
				link.addEventListener('click', () => closePanel());
			});

			window.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					closePanel();
				}
			});
		}

		// Requests counter animation
		const requestsCounterEl = document.querySelector('[data-requests-counter]');
		if (requestsCounterEl) {
			const REQUESTS_PER_MONTH = 4_000_000_000;
			const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;
			const requestsPerSecond = REQUESTS_PER_MONTH / SECONDS_PER_MONTH;
			const formatter = new Intl.NumberFormat();
			const startTime = performance.now();

			const updateCounter = (timestamp: number) => {
				const elapsedSeconds = (timestamp - startTime) / 1000;
				const total = Math.floor(elapsedSeconds * requestsPerSecond);
				requestsCounterEl.textContent = formatter.format(total);
				requestAnimationFrame(updateCounter);
			};

			requestAnimationFrame(updateCounter);
		}
	});
</script>

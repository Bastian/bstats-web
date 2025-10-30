<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
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

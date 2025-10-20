<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Initialize Materialize modals when component mounts
		// @ts-ignore - jQuery/Materialize global from CDN
		if (typeof window !== 'undefined' && window.$) {
			// @ts-ignore
			window.$('.modal').modal();
		}
	});
</script>

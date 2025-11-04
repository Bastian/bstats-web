import { highlightCode } from '$lib/utils/shiki';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	return {
		highlightedCode: await getHighlightedExampleCode(),
		spotlightPlugin: data.spotlightPlugin
	};
};

let _highlightedCode: string;

/**
 * Pre-renders the example code with syntax highlighting during SSR.
 *
 * Caches the result to avoid redundant work and speed up page load.
 */
async function getHighlightedExampleCode() {
	const exampleCode = `public class MyPlugin extends JavaPlugin {
  @Override
  public void onEnable() {
    int pluginId = 12345; // Your unique plugin ID
    Metrics metrics = new Metrics(this, pluginId);

    // Example custom chart
    metrics.addCustomChart(
      new SimplePie("my_chart", () -> "My Value")
    );
  }
}`;

	if (!_highlightedCode) {
		// Pre-render the code with syntax highlighting during SSR
		_highlightedCode = await highlightCode(exampleCode, 'java');
	}
	return _highlightedCode;
}

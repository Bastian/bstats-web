import { createHighlighter, type BundledLanguage } from 'shiki';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

/**
 * Get or create the highlighter instance with all needed languages
 */
async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark'],
			langs: ['java', 'xml', 'kotlin', 'groovy', 'javascript', 'json', 'bash', 'shell', 'http']
		});
	}
	return await highlighterPromise;
}

/**
 * Highlight code with Shiki
 */
export async function highlightCode(code: string, lang: BundledLanguage): Promise<string> {
	const highlighter = await getHighlighter();
	return highlighter.codeToHtml(code, {
		lang,
		theme: 'github-dark'
	});
}

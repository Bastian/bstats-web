import type { Page } from '@sveltejs/kit';

export function getCanonicalUrl(pageUrl: Page['url']): string {
    return `https://${pageUrl.hostname}${pageUrl.pathname}`;
}

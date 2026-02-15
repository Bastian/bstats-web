import { PersistedState } from 'runed';
import { browser } from '$app/environment';

export type ThemePreference = 'system' | 'light' | 'dark';

export const themePreference = new PersistedState<ThemePreference>('bstats-theme', 'system');

let systemPrefersDark = $state(
    browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
);

if (browser) {
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => (systemPrefersDark = e.matches));
}

/**
 * Resolved dark mode state. Use this instead of reading the DOM class
 * to avoid race conditions with effects that toggle the class.
 */
export const isDark = {
    get current() {
        if (themePreference.current === 'dark') return true;
        if (themePreference.current === 'light') return false;
        return systemPrefersDark;
    }
};

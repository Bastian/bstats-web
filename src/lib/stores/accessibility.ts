import { PersistedState } from 'runed';

interface AccessibilityPreferences {
	showChartPatterns: boolean;
}

export const accessibilityPreferences = new PersistedState<AccessibilityPreferences>(
	'bstats-accessibility-preferences',
	{
		showChartPatterns: false
	}
);

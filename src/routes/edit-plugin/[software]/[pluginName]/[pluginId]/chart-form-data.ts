import type { EditChartData } from './edit-chart-schema';

export interface EditableChart {
    uid?: number;
    id?: string;
    type?: string;
    title?: string;
    data?: Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : [];
}

/**
 * Converts a stored chart into the values the edit form expects.
 *
 * Missing or legacy fields fall back to the same defaults that the add-chart
 * form uses, so old charts can be opened and saved without losing data.
 */
export function chartToFormData(chart: EditableChart): EditChartData {
    const data = chart.data ?? {};
    const common = {
        chartUid: chart.uid ?? 0,
        chartId: chart.id ?? '',
        chartTitle: chart.title ?? '',
        filterEnabled: Boolean(data.enabled)
    };
    const orientation = data.orientation === 'vertical' ? 'vertical' : 'horizontal';
    const valueName = typeof data.valueName === 'string' ? data.valueName : '';

    switch (chart.type) {
        case 'simple_pie':
            return {
                ...common,
                chartType: 'simple_pie',
                blacklistEnabled: Boolean(data.blacklist),
                regexEnabled: Boolean(data.useRegex),
                filter: asStringArray(data.filter)
            };
        case 'advanced_pie':
            return {
                ...common,
                chartType: 'advanced_pie',
                blacklistEnabled: Boolean(data.blacklist),
                regexEnabled: Boolean(data.useRegex),
                maxValue: typeof data.maxValue === 'number' ? data.maxValue : undefined,
                filter: asStringArray(data.filter)
            };
        case 'drilldown_pie':
            return {
                ...common,
                chartType: 'drilldown_pie',
                blacklistEnabled: Boolean(data.blacklist),
                regexEnabled: Boolean(data.useRegex),
                maxValue: typeof data.maxValue === 'number' ? data.maxValue : undefined,
                filter: asStringArray(data.filter)
            };
        case 'single_linechart':
            return {
                ...common,
                chartType: 'single_linechart',
                lineName: typeof data.lineName === 'string' ? data.lineName : (chart.title ?? ''),
                minValue: typeof data.minValue === 'number' ? data.minValue : 0,
                maxValue: typeof data.maxValue === 'number' ? data.maxValue : 1000
            };
        case 'simple_bar':
            return {
                ...common,
                chartType: 'simple_bar',
                valueName,
                orientation
            };
        case 'advanced_bar':
            return {
                ...common,
                chartType: 'advanced_bar',
                valueName,
                barLabels: asStringArray(data.barLabels),
                orientation
            };
        default:
            // Unsupported chart types are not exposed in the edit UI.
            return {
                ...common,
                chartType: 'simple_pie',
                blacklistEnabled: false,
                regexEnabled: false,
                filter: []
            };
    }
}

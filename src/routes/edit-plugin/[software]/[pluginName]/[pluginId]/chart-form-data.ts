import type { EditChartData } from './edit-chart-schema';

export interface EditableChart {
    uid?: number;
    id?: string;
    type?: string;
    title?: string;
    data?: unknown;
}

function asStringArray(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// A stored null means "no bound" to the data processor, so it must survive
function asBound(value: unknown, fallback: number): number | null {
    return typeof value === 'number' || value === null ? value : fallback;
}

/**
 * Converts a stored chart into the values the edit form expects.
 *
 * Missing or legacy fields fall back to the same defaults that the add-chart
 * form uses, so old charts can be opened and saved without losing data.
 */
export function chartToFormData(chart: EditableChart): EditChartData {
    const data = isRecord(chart.data) ? chart.data : {};
    // Filters are nested in `filter`, but older versions of the add form stored them flat
    const filter = isRecord(data.filter) ? data.filter : data;
    const common = {
        chartUid: chart.uid ?? 0,
        chartId: chart.id ?? '',
        chartTitle: chart.title ?? '',
        filterEnabled: Boolean(filter.enabled)
    };
    const orientation = data.orientation === 'vertical' ? 'vertical' : 'horizontal';
    const valueName = typeof data.valueName === 'string' ? data.valueName : '';

    switch (chart.type) {
        case 'simple_pie':
            return {
                ...common,
                chartType: 'simple_pie',
                blacklistEnabled: Boolean(filter.blacklist),
                regexEnabled: Boolean(filter.useRegex),
                filter: asStringArray(filter.filter)
            };
        case 'advanced_pie':
            return {
                ...common,
                chartType: 'advanced_pie',
                blacklistEnabled: Boolean(filter.blacklist),
                regexEnabled: Boolean(filter.useRegex),
                maxValue: typeof filter.maxValue === 'number' ? filter.maxValue : undefined,
                filter: asStringArray(filter.filter)
            };
        case 'drilldown_pie':
            return {
                ...common,
                chartType: 'drilldown_pie',
                blacklistEnabled: Boolean(filter.blacklist),
                regexEnabled: Boolean(filter.useRegex),
                maxValue: typeof filter.maxValue === 'number' ? filter.maxValue : undefined,
                filter: asStringArray(filter.filter)
            };
        case 'single_linechart':
            return {
                ...common,
                chartType: 'single_linechart',
                lineName: typeof data.lineName === 'string' ? data.lineName : (chart.title ?? ''),
                minValue: asBound(filter.minValue, 0),
                maxValue: asBound(filter.maxValue, 1000)
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

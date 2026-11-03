import type { ChartFormData } from './add-chart-schema';

/**
 * Converts validated form fields into the `data` object stored on a chart.
 *
 * Used by both chart creation and chart editing so the two flows always write
 * the same shape to Redis. Filters live in a nested `filter` object, the format
 * of the default charts and the only one the data processor reads.
 */
export function buildChartData(data: ChartFormData): Record<string, unknown> {
    switch (data.chartType) {
        case 'simple_pie':
            return {
                filter: {
                    enabled: data.filterEnabled,
                    useRegex: data.regexEnabled,
                    blacklist: data.blacklistEnabled,
                    filter: data.filter
                }
            };
        case 'advanced_pie':
        case 'drilldown_pie':
            return {
                filter: {
                    enabled: data.filterEnabled,
                    useRegex: data.regexEnabled,
                    blacklist: data.blacklistEnabled,
                    filter: data.filter,
                    maxValue: data.maxValue
                }
            };
        case 'single_linechart':
            return {
                lineName: data.lineName,
                filter: {
                    enabled: data.filterEnabled,
                    minValue: data.minValue,
                    maxValue: data.maxValue
                }
            };
        case 'simple_bar':
            return {
                valueName: data.valueName,
                orientation: data.orientation
            };
        case 'advanced_bar':
            return {
                valueName: data.valueName,
                barLabels: data.barLabels,
                orientation: data.orientation
            };
    }
}

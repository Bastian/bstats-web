import type { z } from 'zod';
import type { addChartSchema } from './add-chart-schema';

type ChartFormData = z.infer<typeof addChartSchema>;

/**
 * Converts validated form fields into the `data` object stored on a chart.
 *
 * Used by both chart creation and chart editing so the two flows always write
 * the same shape to Redis.
 */
export function buildChartData(data: ChartFormData): Record<string, unknown> {
    switch (data.chartType) {
        case 'simple_pie':
            return {
                enabled: data.filterEnabled,
                useRegex: data.regexEnabled,
                blacklist: data.blacklistEnabled,
                filter: data.filter
            };
        case 'advanced_pie':
        case 'drilldown_pie':
            return {
                enabled: data.filterEnabled,
                maxValue: data.maxValue,
                useRegex: data.regexEnabled,
                blacklist: data.blacklistEnabled,
                filter: data.filter
            };
        case 'single_linechart':
            return {
                lineName: data.lineName,
                enabled: data.filterEnabled,
                minValue: data.minValue,
                maxValue: data.maxValue
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

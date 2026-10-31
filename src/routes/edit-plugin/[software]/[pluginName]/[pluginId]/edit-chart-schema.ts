import { z } from 'zod';
import { chartTypeOptions } from './chart-schema-fields';

/*
 * Editing is intentionally more lenient with text than creation: charts made
 * before the edit form existed may contain punctuation or other characters
 * that the creation form rejects. Everything else is validated the same way,
 * so old charts stay editable without weakening creation.
 */
const editChartId = z
    .string()
    .trim()
    .nonempty('Must not be empty')
    .max(50)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Can only contain letters, numbers, dots, dashes and underscores');

const editChartTitle = z.string().trim().nonempty('Must not be empty').max(50);

const editLineName = z.string().trim().nonempty('Must not be empty').max(50);

const editValueName = z.string().trim().max(50).default('');

const editBarLabels = z.array(z.string().trim().max(50)).max(25).default([]);

const editFields = {
    // The chart UID never changes, even when the chart ID does.
    chartUid: z.number().int().nonnegative(),
    chartId: editChartId,
    chartTitle: editChartTitle
};

export const editChartSchema = z.discriminatedUnion('chartType', [
    chartTypeOptions.simple_pie.extend(editFields),
    chartTypeOptions.advanced_pie.extend(editFields),
    chartTypeOptions.drilldown_pie.extend(editFields),
    chartTypeOptions.simple_bar.extend({
        ...editFields,
        valueName: editValueName
    }),
    chartTypeOptions.advanced_bar.extend({
        ...editFields,
        valueName: editValueName,
        barLabels: editBarLabels
    }),
    chartTypeOptions.single_linechart.extend({
        ...editFields,
        lineName: editLineName
    })
]);

export type EditChartData = z.infer<typeof editChartSchema>;

import { z } from 'zod';
import {
    chartIdField,
    chartTitleField,
    chartTypeOptions,
    lineNameField
} from './chart-schema-fields';

/*
 * Existing charts may break the creation rules, e.g. legacy characters or
 * default titles that grew past 50 characters with a long plugin name. The
 * schema accepts them so these charts stay editable, and
 * findInvalidChangedText applies the creation rules to values that changed.
 */
const legacyText = z.string().trim().nonempty('Must not be empty');

const editFields = {
    // The chart UID never changes, even when the chart ID does.
    chartUid: z.number().int().nonnegative(),
    chartId: legacyText,
    chartTitle: legacyText
};

export const editChartSchema = z.discriminatedUnion('chartType', [
    chartTypeOptions.simple_pie.extend(editFields),
    chartTypeOptions.advanced_pie.extend(editFields),
    chartTypeOptions.drilldown_pie.extend(editFields),
    chartTypeOptions.simple_bar.extend(editFields),
    chartTypeOptions.advanced_bar.extend(editFields),
    chartTypeOptions.single_linechart.extend({
        ...editFields,
        lineName: legacyText
    })
]);

export type EditChartData = z.infer<typeof editChartSchema>;

const strictTextFields = {
    chartId: chartIdField,
    chartTitle: chartTitleField,
    lineName: lineNameField
};

type StrictTextField = keyof typeof strictTextFields;

/** Returns the first changed text field that breaks the creation rules. */
export function findInvalidChangedText(
    data: EditChartData,
    stored: EditChartData
): { field: StrictTextField; message: string } | undefined {
    for (const field of Object.keys(strictTextFields) as StrictTextField[]) {
        const value = (data as Record<string, unknown>)[field];
        if (value === undefined || value === (stored as Record<string, unknown>)[field]) {
            continue;
        }

        const result = strictTextFields[field].safeParse(value);
        if (!result.success) {
            return { field, message: result.error.issues[0].message };
        }
    }
}

/*
 * NOTE:
 * tms2000 means 'Thirty minutes since 2000'.
 * It's the same idea like timestamps, but an other starting point and a different interval.
 */

/**
 * Converts a date to a tms2000 value.
 *
 * @param date The date to convert.
 * @returns The tms2000 value.
 */
export function dateToTms2000(date: Date): number {
	const past = Date.UTC(2000, 1, 1, 0, 0, 0, 0);
	return ((date.getTime() - past) / (1000 * 60 * 30)) | 0;
}

/**
 * Converts tms2000 to date.
 *
 * @param tms2000 The tms2000 value.
 * @returns The date.
 */
export function tms2000ToDate(tms2000: number): Date {
	const past = Date.UTC(2000, 1, 1, 0, 0, 0, 0);
	return new Date(past + tms2000 * 1000 * 60 * 30);
}

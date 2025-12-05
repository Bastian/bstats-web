/**
 * Gets the days since the given date.
 */
export function daysSince(date: string | Date): number {
    const pastDate = date instanceof Date ? date : new Date(date);
    const today = new Date();
    const diffInMs = today.getTime() - pastDate.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

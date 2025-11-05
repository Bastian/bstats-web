import * as databaseManager from '../databaseManager.js';
import * as timeUtil from '../timeUtil.js';

export async function getLimitedLineChartData(
    chartUid: number,
    line: string,
    amount: number
): Promise<Array<[number, number]>> {
    let startDate =
        timeUtil.tms2000ToDate(timeUtil.dateToTms2000(new Date()) - 1).getTime() -
        1000 * 60 * 30 * amount;

    const datesToFetch: number[] = [];
    for (let i = 0; i < amount; i++) {
        startDate += 1000 * 60 * 30;
        datesToFetch.push(startDate);
    }

    const res = await databaseManager
        .getRedisCluster()
        .hmget(`data:${chartUid}.${line}`, ...datesToFetch.map(String));

    const data: Array<[number, number]> = [];
    for (let i = 0; i < res.length; i++) {
        const value = res[i];
        if (value !== null && !isNaN(parseInt(value))) {
            data.push([datesToFetch[i], parseInt(value)]);
        } else if (value !== 'ignored') {
            data.push([datesToFetch[i], 0]);
        }
    }

    return data;
}

export async function deleteChartLineData(chartUid: number): Promise<void> {
    await databaseManager.getRedisCluster().del(`data:${chartUid}.1`);
}

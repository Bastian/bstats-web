import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as dataManager from '$lib/server/dataManager.js';

export const GET: RequestHandler = async () => {
	try {
		// Get all plugin IDs
		const pluginIds = await new Promise<string[]>((resolve, reject) => {
			dataManager.getAllPluginIds((err: any, ids: string[]) => {
				if (err) reject(err);
				else resolve(ids || []);
			});
		});

		// Get all software to map IDs to names
		const allSoftware = await new Promise<any[]>((resolve, reject) => {
			dataManager.getAllSoftware(['name', 'url'], (err: any, result: any[]) => {
				if (err) reject(err);
				else resolve(result || []);
			});
		});

		// Create a map for quick lookups
		const softwareMap = new Map();
		allSoftware.forEach((software) => {
			softwareMap.set(software.id, software);
		});

		// Get plugin data with server and player counts
		const pluginPromises = pluginIds.map(async (pluginId) => {
			try {
				// Get plugin basic data
				const plugin = await new Promise<any>((resolve, reject) => {
					dataManager.getPluginById(
						pluginId,
						['name', 'software', 'owner'],
						(err: any, result: any) => {
							if (err) reject(err);
							else resolve(result);
						}
					);
				});

				if (!plugin || plugin.name === null) {
					return null; // Skip invalid plugins
				}

				// Get software name
				const software = softwareMap.get(plugin.software);
				const softwareName = software ? software.name : 'Unknown';
				const softwareUrl = software ? software.url : '';

				// Get server count (from 'servers' chart, latest data point)
				let servers = 0;
				try {
					const serversChartUid = await new Promise<number>((resolve, reject) => {
						dataManager.getChartUidByPluginIdAndChartId(
							pluginId,
							'servers',
							(err: any, uid: number) => {
								if (err) resolve(0);
								else resolve(uid || 0);
							}
						);
					});

					if (serversChartUid) {
						const serversData = await new Promise<any[]>((resolve, reject) => {
							dataManager.getLimitedLineChartData(
								serversChartUid,
								1,
								1,
								(err: any, data: any[]) => {
									if (err) resolve([]);
									else resolve(data || []);
								}
							);
						});
						if (serversData.length > 0) {
							servers = serversData[0][1];
						}
					}
				} catch (e) {
					// Ignore errors for individual chart data
				}

				// Get player count (from 'players' chart, latest data point)
				let players = 0;
				try {
					const playersChartUid = await new Promise<number>((resolve, reject) => {
						dataManager.getChartUidByPluginIdAndChartId(
							pluginId,
							'players',
							(err: any, uid: number) => {
								if (err) resolve(0);
								else resolve(uid || 0);
							}
						);
					});

					if (playersChartUid) {
						const playersData = await new Promise<any[]>((resolve, reject) => {
							dataManager.getLimitedLineChartData(
								playersChartUid,
								1,
								1,
								(err: any, data: any[]) => {
									if (err) resolve([]);
									else resolve(data || []);
								}
							);
						});
						if (playersData.length > 0) {
							players = playersData[0][1];
						}
					}
				} catch (e) {
					// Ignore errors for individual chart data
				}

				return {
					name: `<a href="/plugin/${softwareUrl}/${plugin.name}/${plugin.id}">${plugin.name}</a>`,
					softwareName: softwareName,
					ownerName: `<a href="/author/${plugin.owner}">${plugin.owner}</a>`,
					servers: servers.toLocaleString(),
					players: players.toLocaleString()
				};
			} catch (e) {
				console.error(`Error processing plugin ${pluginId}:`, e);
				return null;
			}
		});

		// Wait for all plugins to be processed
		const results = await Promise.all(pluginPromises);

		// Filter out null results
		const validResults = results.filter((r) => r !== null);

		return json(validResults);
	} catch (error) {
		console.error('Error fetching datatable data:', error);
		return json({ error: 'Failed to fetch plugin data' }, { status: 500 });
	}
};

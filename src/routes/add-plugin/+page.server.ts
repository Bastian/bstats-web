import type { PageServerLoad, Actions } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect, fail } from '@sveltejs/kit';
import { getAllSoftware, getSoftwareById } from '$lib/server/redis/software.js';
import {
	getPluginBySoftwareUrlAndName,
	addPlugin,
	updatePluginCharts
} from '$lib/server/redis/plugins.js';
import { createChart } from '$lib/server/redis/charts.js';
import config from '$lib/server/config.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.loggedIn || !locals.user) {
		throw redirect(303, '/login');
	}

	// Get all software for the dropdown
	const allSoftware = await getAllSoftware([
		'name',
		'url',
		'globalPlugin',
		'defaultCharts'
	]);

	// Filter software - only show those with globalPlugin or if user is admin
	const filteredSoftware = allSoftware.filter(
		(sw) => sw.globalPlugin !== null || locals.user?.admin
	);

	return {
		allSoftware: filteredSoftware,
		recaptchaPublicKey: config.recaptcha.publicKey
	};
};

export const actions = {
	default: async ({ request, locals }: RequestEvent) => {
		if (!locals.loggedIn || !locals.user) {
			throw redirect(303, '/login');
		}

		const data = await request.formData();
		const pluginName = data.get('pluginName')?.toString();
		const softwareId = data.get('software')?.toString();
		const recaptchaResponse = data.get('g-recaptcha-response')?.toString();

		// Validate plugin name
		if (!pluginName || pluginName.length === 0 || pluginName.length > 32) {
			return fail(400, { error: 'invalidName' });
		}

		const trimmedName = pluginName.substring(0, 32);

		// Validate plugin name format
		if (!/^[-_a-zA-Z0-9]+(\s[-_a-zA-Z0-9]+)*$/.test(trimmedName)) {
			return fail(400, { error: 'invalidName' });
		}

		// Validate software ID
		if (!softwareId) {
			return fail(400, { error: 'failed' });
		}

		// Verify reCAPTCHA
		if (!recaptchaResponse) {
			return fail(400, { error: 'wrongCaptcha' });
		}

		let pluginId: number;
		let trimmedNameForRedirect: string;

		try {
			// Verify reCAPTCHA with Google
			const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${recaptchaResponse}`;
			const verificationResult = await fetch(verificationUrl, { method: 'POST' });
			const verificationBody = await verificationResult.json();

			if (!verificationBody.success) {
				return fail(400, { error: 'wrongCaptcha' });
			}

			// Get software details
			const software = await getSoftwareById(parseInt(softwareId), [
				'name',
				'url',
				'globalPlugin',
				'defaultCharts'
			]);

			if (!software || (software.globalPlugin === null && !locals.user.admin)) {
				return fail(400, { error: 'failed' });
			}

			// Check if plugin already exists
			const existingPlugin = await getPluginBySoftwareUrlAndName(
				software.url,
				trimmedName.toLowerCase(),
				['name']
			);

			if (existingPlugin !== null) {
				return fail(400, { error: 'alreadyAdded' });
			}

			// Create plugin object
			const plugin = {
				name: trimmedName,
				software: software.id.toString(),
				charts: '[]',
				owner: locals.user.username
			};

			// Add plugin to database
			pluginId = await addPlugin(plugin as any, software as any);

			// Add default charts
			const chartUids: number[] = [];
			for (let i = 0; i < software.defaultCharts.length; i++) {
				const chartUid = await addChart(pluginId, trimmedName, software.defaultCharts[i], i);
				chartUids.push(chartUid);
			}

			// Update plugin with chart UIDs
			await updatePluginCharts(pluginId, chartUids);

			trimmedNameForRedirect = trimmedName;
		} catch (err) {
			console.error('Error adding plugin:', err);
			return fail(500, { error: 'failed' });
		}

		// Redirect to include-metrics page with success params (outside try-catch)
		throw redirect(
			303,
			`/getting-started/include-metrics?addedPlugin=true&pluginName=${encodeURIComponent(trimmedNameForRedirect)}&pluginId=${pluginId}`
		);
	}
} satisfies Actions;

async function addChart(
	pluginId: number,
	pluginName: string,
	chart: any,
	position: number
): Promise<number> {
	// Replace %plugin.name% in chart title
	const chartTitle = chart.title.replace('%plugin.name%', pluginName);

	const chartUid = await createChart(pluginId, {
		id: chart.id,
		type: chart.type,
		position,
		title: chartTitle,
		isDefault: true,
		data: chart.data
	});

	return chartUid;
}
